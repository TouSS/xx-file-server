const fs = require('fs')

const config = require('../config')
const fileUtil = require('../utils/util.file')()
const historyUtil = require('../utils/util.history')
module.exports = () => {
    return {
        put: (ctx, next) => {
            let file = ctx.request.files.file
            //类型匹配
            if(!fileUtil.isRightFile(config.upload.fileAllowFiles, file)) {
                ctx.throw(500, '请上传指定类型文件.')
            }
            let size = file.size
            if(size > config.upload.fileSize) {
                ctx.throw(500, '文件过大, 请上传指定大小文件.')
            }

            let other = fileUtil.persist(config.path.root + config.path.other, file)

            let url = config.path.other + other.relativePath
            //添加历史
            historyUtil.add({url: url}, historyUtil.FILE_TYPE_OTHER)

            ctx.body = {
                state: config.state.success,
                url: url,
                title: other.name,
                original: file.name,
                type: file.type,
                size: file.size
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