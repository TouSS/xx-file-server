const path = require('path')

const config = require('../config')
const log = require('../utils/util.log').getLogger()

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
        log.debug(`HTTP/ ${ctx.method}:${ctx.url}[${ctx.req.headers['x-real-ip'] || ctx.ip || 'unknown'}] ${end - start}ms, Origin: ${ctx.get('Origin')}`)
    }
}