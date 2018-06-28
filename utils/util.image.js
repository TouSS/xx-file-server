const fs = require("fs")
const path = require("path")
const crypto = require('crypto')
const http = require('http')
const https = require('https')

const config = require('../config')
const fileUtil = require('./util.file')()
module.exports = () => {
    return new function () {
        /**
         * 下载图片到本地
         * @param {*} dir 
         * @param {*} imageUrlList 
         */
        this.download = async (dir, imageUrlList) => {
            let imageList = []
            for (let i in imageUrlList) {
                try {
                    let image = await this.get(imageUrlList[i], 3000)
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
    }()
}