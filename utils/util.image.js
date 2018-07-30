const fs = require("fs")
const path = require("path")
const crypto = require('crypto')
const http = require('http')
const https = require('https')

const Jimp = require('jimp')
const phantom = require('phantom')

const config = require('../config')
const fileUtil = require('./util.file')()
module.exports = () => {
    return new function () {
        /**
         * 获取网页截图
         * @param {*} dir 
         * @param {*} url 页面URL
         */
        this.catch = async (dir, url) => {
            let instance = await phantom.create(['--ignore-ssl-errors=yes']);
            let page = await instance.createPage();
            page.property('viewportSize', { width: 1920, height: 1080 })
            let status = await page.open(url)
            if ('success' == status) {
                let png = fileUtil.persistBase64(dir, await page.renderBase64('PNG'), '.png')
                instance.exit()
                return png
            } else {
                throw new Error('无法获取页面内容...')
            }
        }
        /**
         * 下载图片到本地
         * @param {*} dir 
         * @param {*} imageUrlList 图片链接
         */
        this.download = async (dir, imageUrlList) => {
            let imageList = []
            for (let i in imageUrlList) {
                try {
                    let image = await this.get(imageUrlList[i], config.upload.imageCatchTimeout)
                    //计算图片MD5
                    let md5 = crypto.createHash('md5')
                    md5.update(image.data)
                    let md5Hex = md5.digest('hex');
                    //文件名（MD5.3/MD5.3/MD5 + 图片后缀）
                    let fileName = md5Hex + '.jpg'
                    let relativePath = '/' + md5Hex.substr(0, 3) + '/' + md5Hex.substr(3, 3) + '/' + fileName
                    let filePath = dir + relativePath
                    //保存文件
                    fileUtil.mkdirs(path.dirname(filePath))
                    fs.writeFileSync(filePath, image.data)

                    imageList.push({
                        state: config.state.success,
                        name: fileName,
                        type: image.type,
                        size: image.size,
                        path: filePath,
                        relativePath: relativePath
                    })
                } catch (err) {
                    imageList.push({
                        state: config.state.failed,
                        source: imageUrlList[i],
                        msg: err.message
                    })
                }
            }
            return imageList
        }

        /**
         * 获取图片文件
         * @param {*} imageUrl 
         * @param {*} timeout 超时时间
         */
        this.get = (imageUrl, timeout) => {
            let getter = imageUrl.indexOf('https') >= 0 ? https : http
            return new Promise((resolve, reject) => {
                let req = getter.get(imageUrl, res => {
                    let code = res.statusCode
                    let contentType = res.headers['content-type']
                    if (!code == 200) {
                        reject(new Error(`Request Failed, Status Code: ${statusCode}`))
                    } else if (!/^image\/.*/.test(contentType)) {
                        reject(new Error(`Invalid content-type, Expected image/* but received ${contentType}`))
                    }
                    let imageBuffer = [];
                    let size = 0
                    res.on('data', chunk => {
                        imageBuffer.push(chunk)
                        size += chunk.length
                    })
                    res.on('end', () => {
                        resolve({
                            data: Buffer.concat(imageBuffer),
                            type: contentType,
                            size: size
                        })
                    })
                    res.on('error', err => {
                        reject(err)
                    })
                })
                //处理连接错误
                req.on('error', (err) => {
                    reject(err)
                })

                //获取超时处理
                setTimeout(() => {
                    //关闭连接
                    req.abort()
                    reject(new Error(`TIMEOUT`))
                }, timeout)
            })
        }

        /**
         * 重定义图片大小
         * @param {*} dir 
         * @param {*} image 
         * @param {*} width 
         * @param {*} height 
         */
        this.resize = (dir, image, width, height) => {
            return new Promise((resolve, reject) => {
                Jimp.read(image, (err, img) => {
                    if (err) reject(err)
                    let sourceWidth = img.bitmap.width
                    let sourceHeight = img.bitmap.height
                    if (sourceWidth <= config.upload.imageResizeMinWidth) {
                        resolve({
                            sourceWidth: sourceWidth,
                            sourceHeight: sourceHeight
                        })
                        //reject('未达到压缩标准, 放弃本次操作.')
                    }
                    if (!width) width = sourceWidth / config.upload.imageResizeScale
                    width = width > config.upload.imageResizeMinWidth ? width : config.upload.imageResizeMinWidth
                    if (!height) height = Jimp.AUTO
                    img.resize(width, height)
                        .getBuffer(Jimp.AUTO, (err, buffer) => {
                            if (err) reject(err)
                            let suffix = img.getMIME().split('/').pop()
                            let thenImg = fileUtil.persistBuffer(dir, buffer, suffix ? '.' + suffix : '.png')
                            thenImg.sourceWidth = sourceWidth
                            thenImg.sourceHeight = sourceHeight

                            resolve(thenImg)
                        })
                })
            })
        }
    }()
}