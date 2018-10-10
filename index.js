const Koa = require('koa');
const app = new Koa();
const cors = require('koa2-cors')
const onerror = require('koa-onerror')
const easyMonitor = require('easy-monitor');
const body = require('koa-body')

const config = require('./config')
const log = require('./utils/util.log').getLogger()
const router = require('./router')
const accessHandler = require('./handlers/handler.access')

easyMonitor('Image-Server');

//错误处理
onerror(app, {
  accepts: () => {
    //JSON格式错误返回 
    return 'json'
  },
  json: (err, ctx) => {
    ctx.body = {
      state: config.state.failed,
      msg: err.message
    }
  }
})

/* app.use(async (ctx, next) => {
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
    //log.error(`${err.message}`)
  }
}) */

app.use(accessHandler())

//允许跨域
app.use(cors({ origin: '*' }))

//静态资源目录
app.use(require('koa-static')(config.path.root, {
  maxage: 1000 * 60 * 10 //浏览器缓存时间（毫秒）
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

app.on('error', err => {
  let mode = process.env.NODE_ENV || 'development'
  log.error(`${mode == 'development' ? err.stack : err.message}`)
})

app.listen(config.server.port);
log.info(`${config.server.name} started in port ${config.server.port} .`)