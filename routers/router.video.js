const videoHandler = require('../handlers/handler.video')()
module.exports = [
    {
        path: '/video',
        method: 'POST',
        handler: async (ctx, next) => {
            await videoHandler.put(ctx, next)
        }
    }, {
        path: '/video/:name',
        method: 'DELETE',
        handler: (ctx, next) => {
            videoHandler.delete(ctx, next)
        }
    }
]