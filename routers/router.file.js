const handler = require('../handlers/handler.file')()
module.exports = [
    {
        path: '/upload',
        desc: '通用-文件上传, 参数：file - 文件',
        method: 'POST',
        handler: async (ctx, next) => {
            await handler.put(ctx, next)
        }
    }, {
        path: '/file/:name',
        desc: '通用-删除文件, URL参数：name - 文件名称',
        method: 'DELETE',
        handler: (ctx, next) => {
            handler.delete(ctx, next)
        }
    }, {
        path: '/customize/*',
        desc: '通用-上传到自定义目录, 参数：file - 文件名称 ： /customize + 保存路径',
        method: 'POST',
        handler: (ctx, next) => {
            handler.customize(ctx, next)
        }
    }
]