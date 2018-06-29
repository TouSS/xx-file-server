module.exports = () => {
    return async (ctx, next) => {
        //do access here
        let start = new Date().getTime()
        await next()
        let end = new Date().getTime()
        console.log(`HTTP/ ${ctx.method}:${ctx.url}[${ctx.req.headers['x-real-ip'] || ctx.ip || 'unknown'}] ${end - start}ms`)
    }
}