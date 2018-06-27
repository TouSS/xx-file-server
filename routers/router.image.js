const imageHandler = require('../handlers/handler.image')()
module.exports = [
    {
        path: '/image',
        method: 'POST',
        handler: (ctx, next) => {
            imageHandler.put(ctx, next)
        }
    }, {
        path: '/image/:name',
        method: 'DELETE',
        handler: (ctx, next) => {
            imageHandler.delete(ctx, next)
        }
    }
]