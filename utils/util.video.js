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
                ffmpeg(video.path)
                .on('error', err => {
                    reject(err)
                })
                .on('end', () => {
                    resolve(config.path.image + relativeDir + '/' + screenshotName)
                })
                .screenshots({
                    timestamps: [5], //5秒处截图
                    filename: screenshotName,
                    folder: config.path.root + config.path.image + relativeDir
                })
            })
        }
    }()
}