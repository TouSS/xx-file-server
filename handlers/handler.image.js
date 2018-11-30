const fs = require('fs')

const config = require('../config')
const fileUtil = require('../utils/util.file')()
const imageUtil = require('../utils/util.image')()
const wordcloudUtil = require('../utils/util.wordcloud')()
const historyUtil = require('../utils/util.history')

module.exports = () => {
    return {
        put: async (ctx, next) => {
            let file = ctx.request.files.file
            //类型匹配
            if (!fileUtil.isRightFile(config.upload.imageAllowFiles, file)) {
                ctx.throw(500, '请上传指定类型图片文件.')
            }
            let size = file.size
            if (size > config.upload.imageSize) {
                ctx.throw(500, '图片过大, 请上传指定大小图片文件.')
            }
            let image = fileUtil.persist(config.path.root + config.path.image, file)
            //缩小尺寸
            let img = await imageUtil.resize(config.path.root + config.path.image, image.path)
            let url = config.path.image + image.relativePath, thumbnail = img.relativePath ? config.path.image + img.relativePath : ''
            //添加历史
            historyUtil.add({ url: url }, historyUtil.FILE_TYPE_IMAGE)
            ctx.body = {
                state: config.state.success,
                url: url,
                thumbnail: thumbnail,
                title: image.name,
                original: file.name,
                type: file.type,
                size: file.size,
                height: img.sourceHeight,
                width: img.sourceWidth
            }
        },
        putBase64: (ctx, next) => {
            let image = fileUtil.persistBase64(config.path.root + config.path.image, ctx.request.body.file, '.jpg')
            let url = config.path.image + image.relativePath
            //添加历史
            historyUtil.add({ url: url }, historyUtil.FILE_TYPE_IMAGE)
            ctx.body = {
                state: config.state.success,
                url: url,
                title: image.name,
                type: 'image/jpeg',
                size: image.size
            }
        },
        download: async (ctx, next) => {
            let imageUrlList = ctx.request.body.source
            let images = await imageUtil.download(config.path.root + config.path.image, imageUrlList)
            let imgs = [], url
            images.forEach(image => {
                if (config.state.success == image.state) {
                    url = config.path.image + image.relativePath
                    imgs.push({
                        state: image.state,
                        title: image.name,
                        size: image.size,
                        type: image.type,
                        url: url
                    })
                    historyUtil.add({ url: url }, historyUtil.FILE_TYPE_IMAGE)
                } else {
                    imgs.push({
                        state: image.state,
                        msg: image.msg,
                        source: image.source
                    })
                }

            })
            ctx.body = imgs
        },
        catch: async (ctx, next) => {
            let page = ctx.query.page, type = ctx.query.type, width = ctx.query.width, height = ctx.query.height
            let image = await imageUtil.catch(config.path.root + config.path.image, page, width, height)
            let url = config.path.image + image.relativePath
            historyUtil.add({ url: url }, historyUtil.FILE_TYPE_IMAGE)

            if (type && 'redirect' == type) {
                ctx.redirect(url)
            } else {
                ctx.body = {
                    state: config.state.success,
                    url: url,
                    title: image.name,
                    type: 'image/png',
                    size: image.size
                }
            }
        },
        wordcloud: async (ctx, next) => {
            let type = ctx.request.body.type || 'text',
                formated = ctx.request.body.formated,
                backgroundColor = ctx.request.body.backgroundColor || '#fff'
                imageShapeUrl = ctx.request.body.imageShape,
                height = ctx.request.body.height,
                width = ctx.request.body.width,
                text = ctx.request.body.text,
                textFileUrl = ctx.request.body.textFile

            let words = {}
            if('text' == type) {
                words = wordcloudUtil.parseText(text, formated)
            } else if('file' == type) {
                words = await wordcloudUtil.parseFile(textFileUrl, formated)
            }
            let wordcloud = await wordcloudUtil.drawWordcload(words, imageShapeUrl, { width: width, height: height, backgroundColor: backgroundColor })
            let image = fileUtil.persistBuffer(config.path.root + config.path.image, wordcloud, '.png')
            let url = config.path.image + image.relativePath
            ctx.body = {
                state: config.state.success,
                url: url,
                title: image.name,
                type: 'image/png',
                size: image.size,
                width: width ? Number.parseInt(width) : 800,
                height: height ? Number.parseInt(height) : 600
            }
        },
        delete: (ctx, next) => {
            let name = ctx.params.name
            let filePath = config.path.root + config.path.image + '/' + name.substr(0, 3) + '/' + name.substr(3, 3) + '/' + name
            fileUtil.delete(filePath, true)
            ctx.body = {
                state: config.state.success
            }
        }
    }
}