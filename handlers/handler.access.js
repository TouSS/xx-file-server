const path = require('path')

const config = require('../config')

module.exports = () => {
    return async (ctx, next) => {
        if(ctx.url.startsWith(config.path.video)) {
            //video file will not get by static.
            ctx.redirect('/video/' + path.basename(ctx.url))
        }
        //do access here
        let start = new Date().getTime()
        await next()
        let end = new Date().getTime()
        console.log(`[${new Date().toLocaleString()}] HTTP/ ${ctx.method}:${ctx.url}[${ctx.req.headers['x-real-ip'] || ctx.ip || 'unknown'}] ${end - start}ms`)
    }
}