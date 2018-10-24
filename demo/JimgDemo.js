const Jimp = require('jimp');

let image = 'D:/images/004.jpg'
let cover = 'D:/images/hk.jpg'

let out = 'D:/images/out.png'

Jimp.loadFont(Jimp.FONT_SANS_128_WHITE).then((font) => {
    
  
Jimp.read(image)
    .then(img => {
        Jimp.read(cover)
            .then(c => {
                c.opacity(0.9)
                c.resize(300, 300)
                img
                    //.contain(800, 600)
                    //.cover(800, 600)
                    //.resize(800, 600)
                    //.scale(0.5)
                    //.scaleToFit(800, 600)
                    //.crop(100, 100, 800, 600)
                    
                    .flip(true, false)
                    .composite(c, 100, 400, Jimp.BLEND_DARKEN, 0.5, 0.9)
                    //.mirror(true, true)
                    //.rotate(15)
                    .pixelate(5)
                    //.displace(img, -100)
                    //.sepia()
                    //.posterize(2)
                    //.blur(2)
                    //.gaussian(5)
                    //.opaque()
                    //.convolute([[-2, -1, 0], [-1, 1, 1], [0, 1, 2]])
                    //.print(font, 100, 100, 'Hello world!')
                    //.opacity(0.4)
                    //.fade(0.8)
                    .write(out)
                    .pixelate(10)
                    .write('D:/images/ou0t.png')
            })
    })
    .catch(err => {
        console.error(err)
    })

})