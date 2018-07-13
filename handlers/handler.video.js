const fs = require('fs')
const mime = require('mime')
const path = require('path')

const config = require('../config')
const fileUtil = require('../utils/util.file')()
const videoUtil = require('../utils/util.video')()
const historyUtil = require('../utils/util.history')

module.exports = () => {
    return {
        put: async (ctx, next) => {
            let file = ctx.request.files.file
            //类型匹配
            if (!fileUtil.isRightFile(config.upload.videoAllowFiles, file)) {
                ctx.throw(500, '请上传指定类型视频文件.')
            }
            let size = file.size
            if (size > config.upload.videoSize) {
                ctx.throw(500, '视频文件过大, 请上传指定大小视频文件.')
            }
            //保存文件
            let video = fileUtil.persist(config.path.root + config.path.video, file)
            //附加处理
            let screenshot = {}, msg = ''
            try {
                if (/audio\/.*/.test(file.type)) {
                    //音频-专辑图片
                    screenshot = await videoUtil.cover(video)
                } else {
                    //视频-获取截图
                    screenshot = await videoUtil.screenshot(video)

                }
            } catch (err) {
                msg = `媒体文件解析失败：${err.message}`
            }

            let url = config.path.video + video.relativePath
            //添加历史
            historyUtil.add({ url: url, screenshot: screenshot.url }, historyUtil.FILE_TYPE_VIDEO)
            ctx.body = {
                state: config.state.success,
                msg: msg,
                screenshot: screenshot.url,
                length: screenshot.duration,
                url: url,
                title: video.name,
                original: file.name,
                type: file.type,
                size: file.size
            }
        },
        delete: (ctx, next) => {
            let name = ctx.params.name
            let videoPath = config.path.root + config.path.video + '/' + name.substr(0, 3) + '/' + name.substr(3, 3) + '/' + name
            name = name.split('.')[0] + '.png'
            let screenshotPath = config.path.root + config.path.image + '/' + name.substr(0, 3) + '/' + name.substr(3, 3) + '/' + name
            fileUtil.delete(videoPath, true)
            fileUtil.delete(screenshotPath, true)
            ctx.body = {
                state: config.state.success
            }
        },
        stream: (ctx, next) => {
            let name = ctx.params.name
            let contentType = mime.getType(name)
            contentType = contentType ? contentType : 'application/zip'
            let realPath = config.path.root + config.path.video + '/' + name.substr(0, 3) + '/' + name.substr(3, 3) + '/' + name
            if (!fs.existsSync(realPath)) ctx.throw(404, `No page named: ${ctx.url}`)
            ctx.set("Content-Type", contentType)
            if (config.online.allowType.indexOf(contentType) >= 0) {
                let state = fs.statSync(realPath)
                if (ctx.header['range']) {
                    let range = videoUtil.parseRange(ctx.header['range'], state.size)
                    if (range) {
                        ctx.set("Content-Range", "bytes " + range.start + "-" + range.end + "/" + state.size)
                        ctx.set("Content-Length", (range.end - range.start + 1))
                        ctx.status = 206
                        ctx.message = 'Partial Content'
                        ctx.body = fs.createReadStream(realPath, { "start": range.start, "end": range.end })
                    } else {
                        ctx.status = 206
                        ctx.message = 'Request Range Not Satisfiable'
                        ctx.body = ''
                    }
                } else {
                    ctx.status = 200
                    ctx.message = 'Display without Range'
                    ctx.body = fs.createReadStream(realPath)
                }
            } else {
                ctx.status = 200
                ctx.message = 'Media not support'
                ctx.body = fs.createReadStream(realPath)
            }
        }
    }
}