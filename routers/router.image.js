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
        path: '/image/wordcloud',
        desc: '生成词云图, URL参数：type - 类型（text/file），formated - 是否为格式化后数据， imageShape - 词云图形状高对比图片, width - 词云图宽度, height - 词云图高度, POST参数：text - 需要处理得文字段落， file - 需要处理的文本文件',
        method: 'POST',
        handler: async (ctx, next) => {
            await imageHandler.wordcloud(ctx, next)
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