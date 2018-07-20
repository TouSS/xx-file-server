const imageHandler = require('../handlers/handler.image')()
module.exports = [
    {
        path: '/image',
        desc: '图片文件上传, 参数：file - 图片文件',
        method: 'POST',
        handler: async (ctx, next) => {
            await imageHandler.put(ctx, next)
        }
    }, {
        path: '/image/catch',
        desc: '抓取网页截图, URL参数：page - 页面地址',
        method: 'GET',
        handler: async (ctx, next) => {
            await imageHandler.catch(ctx, next)
        }
    }, {
        path: '/image/:name',
        desc: '删除图片文件, URL参数：name - 图片名称',
        method: 'DELETE',
        handler: (ctx, next) => {
            imageHandler.delete(ctx, next)
        }
    }
]