const ffmpeg = require('fluent-ffmpeg')
const config = require('../config')
const fileUtil = require('./util.file')()

module.exports = () => {
    return new function() {
        this.screenshot = (video) => {
            let hex = video.name.split('.')[0]
            let screenshotName = hex + '.png'
            let relativeDir = '/' + hex.substr(0, 3) + '/' + hex.substr(3, 3)
            fileUtil.mkdirs(config.path.root + config.path.image + relativeDir)
            return new Promise((resolve, reject) => {
                let length
                ffmpeg(video.path)
                /* .on("start", commandLine => {
                    //console.log(commandLine)
                })
                .on("codecData", data => {
                    //console.log(data)
                }) */
                .on("progress", progress => {
                    length = Math.floor(4 / progress.percent)
                })
                .on('error', err => {
                    reject(err)
                })
                .on('end', () => {
                    resolve({url: config.path.image + relativeDir + '/' + screenshotName, length: length})
                })
                .screenshots({
                    timestamps: [5], //5秒处截图
                    size: '640x480',
                    filename: screenshotName,
                    folder: config.path.root + config.path.image + relativeDir
                })
            })
        }
    }()
}