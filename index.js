const Koa = require('koa');
const app = new Koa();

const body = require('koa-body')
const config = require('./config')
const router = require('./router')
const cors = require('koa2-cors')

//错误处理
app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    ctx.response.status = err.statusCode || err.status || 500
    ctx.response.body = {
      code: err.statusCode || err.status || 500,
      state: config.state.failed,
      message: err.message
    }
    //ctx.redirect('/500.html');
    //console.error(`error: ${err.message}`)
    console.error(`Error in ${ctx.url}`)
    console.error(err)
  }
})

/* app.use(async (ctx, next) => {
  let start = new Date().getTime()
  await next()
  let end = new Date().getTime()
  console.log(`HTTP/ ${ctx.method}:${ctx.url}[${ctx.req.headers['x-real-ip'] || ctx.ip || 'unknown'}] ${end - start}ms`)
}) */

//允许跨域
app.use(cors())

//静态资源目录
app.use(require('koa-static')(config.path.root, {
  maxage: 1000 * 60 * 10 //浏览器缓存30分钟（毫秒）
}))

//参数对象处理
app.use(body({
  multipart: true,
  formidable: {
    maxFileSize: config.upload.maxSize    // 设置上传文件大小最大限制,默认2M
  }
}))

//加载路由
app.use(router.routes())
app.use(router.allowedMethods())

// 404
app.use(ctx => {
  ctx.throw(404, `No page named: ${ctx.url}`)
});

app.listen(config.server.port);
console.log(`${config.server.name} started in port ${config.server.port} .`)