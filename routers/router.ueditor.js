const ueditorConfig = require('../ueditor.json')
const imageHandler = require('../handlers/handler.image')()
const videoHandler = require('../handlers/handler.video')()
const fileHandler = require('../handlers/handler.file')()
const historyUtil = require('../utils/util.history')

module.exports = [
    {
        path: '/ueditor',
        desc: 'Ueditor全配置',
        method: 'GET',
        handler: (ctx, next) => {
            let action = ctx.query.action
            let start = ctx.query.start, size = ctx.query.size
            switch (action) {
                case 'config':
                    ctx.body = ueditorConfig
                    break
                case 'listimage':
                    ctx.body = historyUtil.get(historyUtil.FILE_TYPE_IMAGE, start, size)
                    break
                case 'listfile':
                    ctx.body = ctx.body = historyUtil.get(historyUtil.FILE_TYPE_OTHER, start, size)
                    break
            }
        }
    },
    {
        path: '/ueditor',
        desc: 'Ueditor相关操作：参数 action - 对应操作',
        method: 'POST',
        handler: async (ctx, next) => {
            let action = ctx.query.action
            switch (action) {
                case 'uploadimage':
                    imageHandler.put(ctx, next)
                    break
                case 'uploadscrawl':
                    imageHandler.putBase64(ctx, next)
                    break
                case 'catchimage':
                    await imageHandler.download(ctx, next)
                    break
                case 'uploadvideo':
                    await videoHandler.put(ctx, next)
                    break
                case 'uploadfile':
                    fileHandler.put(ctx, next)
                    break
            }
        }
    }
]