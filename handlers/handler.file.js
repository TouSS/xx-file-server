const fs = require('fs')
const os = require('os')
const send = require('koa-send')
const ejs = require('ejs')

const config = require('../config')
const fileUtil = require('../utils/util.file')()
const historyUtil = require('../utils/util.history')

const imageHandler = require('./handler.image')()
const videoHandler = require('./handler.video')()

const log = require('../utils/util.log').getLogger()

module.exports = () => {
  return {
    put: async (ctx, next) => {
      let file = ctx.request.files.file
      //类型匹配
      if (!fileUtil.isRightFile(config.upload.fileAllowFiles, file)) {
        ctx.throw(500, '请上传指定类型文件.')
      }
      let size = file.size
      if (size > config.upload.fileSize) {
        ctx.throw(500, '文件过大, 请上传指定大小文件.')
      }

      //根据类型调用不同的处理Handler
      let type = file.type
      if (/image\/.*/.test(type)) {
        await imageHandler.put(ctx, next)
      } else if (/video\/.*/.test(type) || /audio\/.*/.test(type)) {
        await videoHandler.put(ctx, next)
      } else {
        let other = fileUtil.persist(config.path.root + config.path.other, file)

        let url = config.path.other + other.relativePath
        //添加历史
        historyUtil.add({ url: url }, historyUtil.FILE_TYPE_OTHER)

        ctx.body = {
          state: config.state.success,
          url: url,
          title: other.name,
          original: file.name,
          type: file.type,
          size: file.size
        }
      }
    },
    delete: (ctx, next) => {
      let name = ctx.params.name
      let relativePath =
        name.substr(0, 3) + '/' + name.substr(3, 3) + '/' + name
      for (var key in config.path) {
        if ('root' === key) continue
        fileUtil.delete(
          `${config.path.root}${config.path[key]}/${relativePath}`,
          true
        )
      }
      ctx.body = {
        state: config.state.success
      }
    },
    customize: (ctx, next) => {
      let file = ctx.request.files.file
      let url = ctx.url
      url = url.substr(10)
      let saveDir = config.path.root + url
      fileUtil.mkdirs(saveDir)
      let savePath = saveDir + '/' + file.name
      fs.writeFileSync(savePath, fs.readFileSync(file.path))
      ctx.body = {
        state: config.state.success,
        url: url + '/' + file.name
      }
    },
    preview: async (ctx, next) => {
      let name = ctx.params.name
      let path = `${config.path.root}${config.path.other}/${name.substr(0, 3)}/${name.substr(3, 3)}/${name}`
      let previewPath = await fileUtil.convertOfficeFile(name, path)
      try {
        let suffix = fileUtil.getFileSuffix(name)
        if('ppt' == suffix || 'pptx' == suffix) {
          //ppt文件再次转换为图片文件
          let previewDir = `${config.path.root}${config.path.tmp}/${name}`
          if(!fs.existsSync(previewDir)) {
            fileUtil.mkdirs(previewDir)
            let imgs = await fileUtil.pdf2png(`${os.tmpdir()}/${previewPath}`, previewDir)
            let html = await ejs.renderFile(`${config.__home}/templates/ppt.ejs`, {imgs: imgs}, {async: true})
            fs.writeFileSync(`${previewDir}/index.html`, html)
          }
          ctx.redirect(`${config.path.tmp}/${name}/index.html`)
        }
        await send(ctx, previewPath, { root: os.tmpdir() })
      } catch (error) {
        log.error(error)
        ctx.body = '预览失败，请检查文件是否为Office文件。'
      }

    }
  }
}
