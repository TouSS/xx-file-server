const ueditorConfig = require('../ueditor.json')
const imageHandler = require('../handlers/handler.image')()
const videoHandler = require('../handlers/handler.video')()
const fileHandler = require('../handlers/handler.file')()
const historyUtil = require('../utils/util.history')

module.exports = [
    {
        path: '/ueditor',
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
        method: 'POST',
        handler: async (ctx, next) => {
            let action = ctx.query.action
            switch (action) {
                case 'uploadimage':
                case 'uploadscrawl':
                    imageHandler.put(ctx, next)
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