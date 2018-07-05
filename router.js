const Router = require('koa-router')
const fs = require('fs')

let router = new Router()

let apis = []
//加载router目录下的所有路由
let files = fs.readdirSync(__dirname + '/routers')
files.forEach(f => {
    let routers = require(__dirname + '/routers/' + f)
    routers.forEach(r => {
        if('GET' === r.method) {
            //GET
            router.get(r.path, async (ctx, next) => {
                await r.handler(ctx, next)
            })
        } else if('POST' === r.method) {
            //POST
            router.post(r.path, async (ctx, next) => {
                await r.handler(ctx, next)
            })
        } else if('DELETE' === r.method) {
            //DELETE
            router.delete(r.path, async (ctx, next) => {
                await r.handler(ctx, next)
            })
        } else {
            console.warn(`method ${r.method} not supported .` )
        }

        apis.push(`${r.path} -> ${r.method} - ${r.desc}`)
    })
})
//添加说明配置
router.get('/', (ctx, next) => {
    ctx.body = apis
})

module.exports = router
