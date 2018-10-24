const Segment = require('segment')
const { createCanvas, loadImage } = require('canvas')

const WordCloud = require('../lib/wordcloud')
const { sleep } = require('../lib/common')

let segment = new Segment()
segment.useDefault()

module.exports = () => {
    return new function () {
        /**
         * 生成词云图
         */
        this.drawWordcload = () => {

        }

        /**
         * 分词
         */
        this.segment = text => {

        }
    }()
}