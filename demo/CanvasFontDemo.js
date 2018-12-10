const fs = require('fs')
const { registerFont, createCanvas } = require('canvas')

registerFont('./demo/arial.ttf', {family: 'arial'})

let configCanvas = createCanvas(1000, 1000), configCtx = configCanvas.getContext('2d')


let str = '来一串中文吧。。。'
configCtx.font = '50px "arial"'
let text = configCtx.measureText(str)

let space = 20

let drawCanvas = createCanvas((str.length - 1) * space + text.width, text.actualBoundingBoxAscent + text.actualBoundingBoxDescent), drawCtx = drawCanvas.getContext('2d')
drawCtx.font = '50px "arial"'
drawCtx.fillStyle  = 'blue'
let offsetX = 0, offsetY = 0
for(let i = 0; i < str.length; i++) {
    text = configCtx.measureText(str.charAt(i))
    if(i == 0) {
        offsetY = text.actualBoundingBoxAscent
    }
    drawCtx.fillText(str.charAt(i), offsetX, offsetY)

    offsetX += text.width + space
}

//drawCtx.fillText(str, 0, text.actualBoundingBoxAscent)

fs.writeFileSync('./demo/font.png', drawCanvas.toBuffer())