const http = require('http')
const https = require('https')

const Segment = require('segment')
const { createCanvas, loadImage } = require('canvas')

const WordCloud = require('../lib/wordcloud')

let segment = new Segment()
segment.useDefault()

/**
 * 词云形状底图绘制
 * @param {*} src 图片地址
 */
let drawImageShape = async src => {
  let img = await loadImage(src)

  imageShapeCanvas = createCanvas()
  imageShapeCanvas.width = img.width
  imageShapeCanvas.height = img.height
  let ctx = imageShapeCanvas.getContext('2d')
  ctx.drawImage(img, 0, 0, img.width, img.height)

  let imageData = ctx.getImageData(
    0,
    0,
    imageShapeCanvas.width,
    imageShapeCanvas.height
  )
  let newImageData = ctx.createImageData(imageData)

  for (let i = 0; i < imageData.data.length; i += 4) {
    let tone = imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]
    let alpha = imageData.data[i + 3]

    if (alpha < 128 || tone > 128 * 3) {
      // Area not to draw
      newImageData.data[i] = newImageData.data[i + 1] = newImageData.data[
        i + 2
      ] = 255
      newImageData.data[i + 3] = 0
    } else {
      // Area to draw
      newImageData.data[i] = newImageData.data[i + 1] = newImageData.data[
        i + 2
      ] = 0
      newImageData.data[i + 3] = 255
    }
  }
  ctx.putImageData(newImageData, 0, 0)

  return imageShapeCanvas
}

/**
 * 绘制词云
 * @param {*} canvas 绘制面板
 * @param {*} options 绘制配置项
 */
let renderWordCloud = async (canvas, options) => {
  if (options.imageShape) {
    let imageShapeCanvas = await drawImageShape(options.imageShape)
    options.clearCanvas = false
    let ctx = canvas.getContext('2d')
    ctx.fillStyle = options.backgroundColor || '#fff'
    ctx.fillRect(0, 0, 1, 1)
    let bgPixel = ctx.getImageData(0, 0, 1, 1).data
    ctx.drawImage(
      imageShapeCanvas,
      0,
      0,
      imageShapeCanvas.width,
      imageShapeCanvas.height,
      0,
      0,
      canvas.width,
      canvas.height
    )
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    let newImageData = ctx.createImageData(imageData)
    for (let i = 0; i < imageData.data.length; i += 4) {
      if (imageData.data[i + 3] > 128) {
        newImageData.data[i] = bgPixel[0]
        newImageData.data[i + 1] = bgPixel[1]
        newImageData.data[i + 2] = bgPixel[2]
        newImageData.data[i + 3] = bgPixel[3]
      } else {
        // This color must not be the same w/ the bgPixel.
        newImageData.data[i] = bgPixel[0]
        newImageData.data[i + 1] = bgPixel[1]
        newImageData.data[i + 2] = bgPixel[2]
        newImageData.data[i + 3] = bgPixel[3] ? bgPixel[3] - 1 : 0
      }
    }
    ctx.putImageData(newImageData, 0, 0)
    WordCloud(canvas, options)
  } else {
    WordCloud(canvas, options)
  }
}

module.exports = () => {
  return new function() {
    /**
     * 生成词云图
     */
    this.drawWordcload = async (words, imageShape, options) => {
      let list = []
      for (let key in words) {
        list.push([key, words[key]])
      }
      let defaultOptions = {
        list: list,
        gridSize: 2,
        weightFactor: 4,
        color: 'random-dark',
        backgroundColor: '#f0f0f0',
        rotateRatio: 0.5,
        imageShape: imageShape
      }
      if (options) {
        for (let key in options) {
          defaultOptions[key] = options[key]
        }
      }
      let canvas = createCanvas(
        defaultOptions.width ? Number.parseInt(defaultOptions.width) : 800,
        defaultOptions.height ? Number.parseInt(defaultOptions.height) : 600
      )
      await renderWordCloud(canvas, defaultOptions)
      return canvas.toBuffer()
    }

    /**
     * 分词
     */
    this.segment = text => {
      let words = segment.doSegment(text, {
        stripPunctuation: true,
        stripStopword: true
      })

      let wordsCount = {}
      words.forEach(word => {
        //名词, 成语, 习语, 时间词, 人名, 地名, 机构团体, 其他专名, 网址、邮箱地址
        if (
          0x01000000 == word.p ||
          0x00800000 == word.p ||
          0x00100000 == word.p ||
          0x00004000 == word.p ||
          0x00000080 == word.p ||
          0x00000040 == word.p ||
          0x00000020 == word.p ||
          0x00000008 == word.p ||
          0x00000001 == word.p
        ) {
          if (wordsCount[word.w]) {
            wordsCount[word.w]++
          } else {
            wordsCount[word.w] = 1
          }
        }
      })

      return wordsCount
    }

    /**
     * 段落文本统计
     */
    this.parseText = (text, fomated) => {
      if (fomated) {
        let wordsCount = {}
        text.split('\n').forEach(item => {
          let tmp = item.split(',')
          if (tmp.length == 2) {
            wordsCount[tmp[0].trim()] = Number.parseInt(tmp[1].trim())
          }
        })
        return wordsCount
      } else {
        return this.segment(text)
      }
    }

    /**
     * 文件内容统计
     */
    this.parseFile = (url, fomated) => {
      let getter = url.indexOf('https') >= 0 ? https : http
      return new Promise((resolve, reject) => {
        let req = getter.get(url, res => {
          let code = res.statusCode
          if (!code == 200) {
            return reject(
              new Error(`Request Failed, Status Code: ${statusCode}`)
            )
          }
          let buffer = []
          let size = 0
          res.on('data', chunk => {
            buffer.push(chunk)
            size += chunk.length
          })
          res.on('end', () => {
            let text = Buffer.concat(buffer)
              .toString()
              .trim()
            if (text) {
              if (fomated) {
                let wordsCount = {}
                text.split('\n').forEach(item => {
                  let tmp = item.split(',')
                  if (tmp.length == 2) {
                    wordsCount[tmp[0].trim()] = Number.parseInt(tmp[1].trim())
                  }
                })
                return resolve(wordsCount)
              } else {
                return resolve(this.segment(text))
              }
            }
          })
          res.on('error', err => {
            return reject(err)
          })
        })
        //处理连接错误
        req.on('error', err => {
          return reject(err)
        })
        //获取超时处理
        setTimeout(() => {
          //关闭连接
          req.abort()
          return reject(new Error(`TIMEOUT`))
        }, 10 * 1000)
      })
    }
  }()
}
