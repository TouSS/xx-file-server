const ueditorConfig = require('../ueditor.json')
module.exports = [
    {
        path: '/ueditor',
        method: 'GET',
        handler: (ctx, next) => {
            ctx.body = ueditorConfig
        }
    },
    {
        path: '/ueditor',
        method: 'POST',
        handler: (ctx, next) => {
            ctx.body = ueditorConfig
        }
    }
]