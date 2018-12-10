const { registerFont, createCanvas } = require('canvas')

const config = require('../config')
const fileUtil = require('../utils/util.file')()
const fontUtil = require('../utils/util.font')

module.exports = () => {
    return {
        addFont: (ctx, next) => {
            let font = ctx.request.files.file
            //判断文件是否为字体
            if (!fileUtil.isRightFile(['.ttf', 'otf'], font)) {
                ctx.throw(500, '请上传正确的字体文件.')
            }
            //保存
            fileUtil.write(config.font.dir, font)
            ctx.body = {
                state: config.state.success
            }
        },
        listFont: (ctx, next) => {
            ctx.body = fileUtil.list(config.font.dir)
        },
        imageText: (reqCtx, next) => {
            let textContent = reqCtx.query.text,
                color = reqCtx.query.color,
                size = reqCtx.query.size,
                font = reqCtx.query.font,
                space = reqCtx.query.space
            if (!textContent || !font || !size) {
                reqCtx.throw(500, '参数不完整：文字内容, 字体, 大小为必须内容')
            }
            let fontFile = fontUtil.get(font)
            if (!fontFile) reqCtx.throw(500, '字体文件不存在, 你可以先上传该字体文件')
            registerFont(fontFile, { family: font })

            font = `${size.replace('px', '')}px "${font}"`
            space = space ? Number.parseInt(space) : 0
            let confCanvas = createCanvas(1000, 1000), confCtx = confCanvas.getContext('2d')
            confCtx.font = font
            let text = confCtx.measureText(textContent)

            let drawCanvas = createCanvas((textContent.length - 1) * space + text.width, text.actualBoundingBoxAscent + text.actualBoundingBoxDescent),
                drawCtx = drawCanvas.getContext('2d')
            drawCtx.font = font
            drawCtx.fillStyle = color || '#000'

            let offsetX = 0, offsetY = 0
            for (let i = 0; i < textContent.length; i++) {
                text = confCtx.measureText(textContent.charAt(i))
                if (i == 0) {
                    offsetY = text.actualBoundingBoxAscent
                }
                drawCtx.fillText(textContent.charAt(i), offsetX, offsetY)
                offsetX += text.width + space
            }


            /* let canvas = createCanvas(), ctx = canvas.getContext('2d')
            ctx.font = `${size} "${font}"`
            ctx.fillStyle = '#' + color || '#000'
            let text = ctx.measureText(textContent)
            canvas.width = (textContent.length - 1) * space + text.width
            canvas.height = text.actualBoundingBoxAscent + text.actualBoundingBoxDescent
            let offsetX = 0, offsetY = 0
            for (let i = 0; i < textContent.length; i++) {
                text = ctx.measureText(textContent.charAt(i))
                if (i == 0) {
                    offsetY = text.actualBoundingBoxAscent
                }
                ctx.fillText(textContent.charAt(i), offsetX, offsetY)
                offsetX += text.width + space
            } */
            reqCtx.set("Content-Type", "image/png")
            reqCtx.body = drawCanvas.toBuffer('image/png')
        }
    }
}