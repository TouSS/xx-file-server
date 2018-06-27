const fs = require('fs')
const config = require('../config')
const fileUtil = require('../utils/util.file')()
module.exports = () => {
    return {
        put: (ctx, next) => {
            let file = ctx.request.files.file
            let size = file.size
            if(size > config.upload.fileSize) {
                ctx.throw(500, '文件过大, 请上传指定大小文件.')
            }

            let other = fileUtil.persist(config.path.root + config.path.other, file)
            ctx.body = {
                state: config.state.success,
                url: ctx.host + config.path.other + other.relativePath
            }
            
        },
        delete: (ctx, next) => {
            let name = ctx.params.name
            let filePath = config.path.root + config.path.other + '/' + name.substr(0, 3) + '/' + name.substr(3, 3) + '/' + name
            fileUtil.delete(filePath, true)
            ctx.body = {
                state: config.state.success
            }
        }
    }
}