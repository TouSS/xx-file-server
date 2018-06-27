const fs = require('fs')
const config = require('../config')
const fileUtil = require('../utils/util.file')()
const videoUtil = require('../utils/util.video')()
module.exports = () => {
    return {
        put: async (ctx, next) => {
            let file = ctx.request.files.file
            let size = file.size
            if(size > config.upload.videoSize) {
                ctx.throw(500, '视频文件过大, 请上传指定大小视频文件.')
            }
            //保存文件
            let video = fileUtil.persist(config.path.root + config.path.video, file)
            //提取预览图
            let screenshotUrl = '', msg = ''
            try {
                screenshotUrl = await videoUtil.screenshot(video)
            } catch (err) {
                screenshotUrl = ''
                msg = `获取预览图失败：${err.message}`
            }
            
            ctx.body = {
                state: config.state.success,
                msg: msg,
                screenshot: ctx.host + screenshotUrl,
                url: ctx.host + config.path.video + video.relativePath
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
        }
    }
}