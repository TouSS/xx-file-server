const handler = require('../handlers/handler.file')()
module.exports = [
    {
        path: '/upload',
        desc: '其他类型文件上传, 参数：file - 文件',
        method: 'POST',
        handler: (ctx, next) => {
            handler.put(ctx, next)
        }
    }, {
        path: '/file/:name',
        desc: '删除文件, URL参数：name - 文件名称',
        method: 'DELETE',
        handler: (ctx, next) => {
            handler.delete(ctx, next)
        }
    }
]