const fs = require('fs')
const { registerFont, createCanvas } = require('canvas')

registerFont('./test/arial.ttf', {family: 'arial'})

let canvas = createCanvas(1000, 1000), ctx = canvas.getContext('2d')

let str = 'Hello World !!!'
ctx.font = '100px arial'
ctx.fillStyle  = 'blue'
let text = ctx.measureText(str)

let space = -30
canvas.width = (str.length - 1) * space + text.width
canvas.height = text.actualBoundingBoxAscent + text.actualBoundingBoxDescent

let offsetX = 0, offsetY = 0
for(let i = 0; i < str.length; i++) {
    text = ctx.measureText(str.charAt(i))
    if(i == 0) {
        offsetY = text.actualBoundingBoxAscent
    }
    ctx.fillText(str.charAt(i), offsetX, offsetY)

    offsetX += text.width + space
}

//ctx.fillText(str, 0, text.actualBoundingBoxAscent)

fs.writeFileSync('./demo/font.png', canvas.toBuffer())