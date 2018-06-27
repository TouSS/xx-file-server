const fs = require('fs')
const config = require('../config')
const fileUtil = require('../utils/util.file')()
module.exports = () => {
    return {
        put: (ctx, next) => {
            let file = ctx.request.files.file
            let size = file.size
            if(size > config.upload.imageSize) {
                ctx.throw(500, '图片过大, 请上传指定大小图片文件.')
            }
            let image = fileUtil.persist(config.path.root + config.path.image, file)
            ctx.body = {
                state: config.state.success,
                url: ctx.host + config.path.image + image.relativePath
            }
        },
        delete: (ctx, next) => {
            let name = ctx.params.name
            let filePath = config.path.root + config.path.image + '/' + name.substr(0, 3) + '/' + name.substr(3, 3) + '/' + name
            fileUtil.delete(filePath, true)
            ctx.body = {
                state: config.state.success
            }
        }
    }
}