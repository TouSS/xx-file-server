const handler = require('../handlers/handler.text')()

module.exports = [
    {
        path: '/font',
        desc: '字体文件上传, 参数：file - 字体文件',
        method: 'POST',
        handler: (ctx, next) => {
            handler.addFont(ctx, next)
        }
    }, {
        path: '/font',
        desc: '字体文件列表',
        method: 'GET',
        handler: (ctx, next) => {
            handler.listFont(ctx, next)
        }
    }, {
        path: '/imageText',
        desc: '获取包裹文字内容的图片, 参数: text-文字内容, font-字体, size-大小, color-颜色， space-字间距',
        method: 'GET',
        handler: (ctx, next) => {
            handler.imageText(ctx, next)
        }
    }
]