const handler = require('../handlers/handler.file')()
module.exports = [
    {
        path: '/upload',
        method: 'POST',
        handler: (ctx, next) => {
            handler.put(ctx, next)
        }
    }, {
        path: '/file/:name',
        method: 'DELETE',
        handler: (ctx, next) => {
            handler.delete(ctx, next)
        }
    }
]