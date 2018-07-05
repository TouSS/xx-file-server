const videoHandler = require('../handlers/handler.video')()
module.exports = [
    {
        path: '/video',
        desc: '视频文件上传, 参数：file - 视频文件',
        method: 'POST',
        handler: async (ctx, next) => {
            await videoHandler.put(ctx, next)
        }
    }, {
        path: '/video/:name',
        desc: '删除视频文件, URL参数：name - 视频名称',
        method: 'DELETE',
        handler: (ctx, next) => {
            videoHandler.delete(ctx, next)
        }
    }
]