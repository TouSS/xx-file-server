const ffmpeg = require('fluent-ffmpeg')
const config = require('../config')
const fileUtil = require('./util.file')()

module.exports = () => {
    return new function () {
        /**
         * 视频截图
         * @param {*} video 
         */
        this.screenshot = video => {
            let hex = video.name.split('.')[0]
            let screenshotName = hex + '.png'
            let relativeDir = '/' + hex.substr(0, 3) + '/' + hex.substr(3, 3)
            fileUtil.mkdirs(config.path.root + config.path.image + relativeDir)
            return new Promise((resolve, reject) => {
                let info, stdout = []
                ffmpeg(video.path)
                    .on('stderr', line => {
                        stdout.push(line)
                    })
                    .on('error', err => {
                        reject(err)
                    })
                    .on('end', () => {
                        info = this.parseInfo(stdout)
                        info.url = config.path.image + relativeDir + '/' + screenshotName
                        resolve(info)
                    })
                    .screenshots({
                        timestamps: [5], //5秒处截图
                        size: '640x?',
                        filename: screenshotName,
                        folder: config.path.root + config.path.image + relativeDir
                    })
            })
        }

        /**
         * 获取音乐文件专辑信息
         * @param {*} audio 
         */
        this.cover = audio => {
            let hex = audio.name.split('.')[0]
            let coverName = hex + '.png'
            let relativeDir = '/' + hex.substr(0, 3) + '/' + hex.substr(3, 3)
            fileUtil.mkdirs(config.path.root + config.path.image + relativeDir)
            return new Promise((resolve, reject) => {
                let info, stdout = [], coverUrl = config.path.image + relativeDir + '/' + coverName
                ffmpeg(audio.path)
                    .size('640x?')
                    .on('error', err => {
                        reject(err)
                    })
                    .on('stderr', line => {
                        stdout.push(line)
                    })
                    .on('end', () => {
                        info = this.parseInfo(stdout)
                        info.url = coverUrl
                        resolve(info)
                    })
                    .save(config.path.root + coverUrl)
            })
        }

        /**
         * 媒体文件播放进度提取
         * @param {*} range 
         * @param {*} size 
         */
        this.parseRange = (range, size) => {
            if (!range || range.indexOf(",") != -1) {
                return;
            }
            if (range.indexOf("=") != -1) {
                range = range.split("=").pop()
            }
            let se = range.split('-')
            let start = parseInt(se[0], 10)
            let end = parseInt(se[1], 10) || size - 1
            if (isNaN(start)) { // -100
                start = size - end;
                end = size - 1;
            }
            if (isNaN(end)) { //100 -
                end = size - 1;
            }
            if (isNaN(start) || isNaN(end) || start > end || end > size) return
            return {
                start: start,
                end: end
            }
        }

        /**
         * 媒体信息
         * @param {*} stdout 
         */
        this.parseInfo = stdout => {
            let info = {}, line, key, kv
            for (let i in stdout) {
                line = stdout[i].trim()
                if (line.startsWith('Output')) break
                kv = line.split(':')
                if (kv.length < 2) continue
                key = kv[0].trim()
                switch (key) {
                    case 'artist':
                        info.artist = kv[1].trim()
                        break
                    case 'title':
                        info.title = kv[1].trim()
                        break
                    case 'date':
                        info.date = kv[1].trim()
                        break
                    case 'track':
                        info.track = kv[1].trim()
                        break
                    case 'Duration':
                        this.formatDuration(line, info)
                        break
                    default:
                        break
                }
            }
            return info
        }

        /**
         * 格式化媒体时长信息
         * @param {*} duration 
         * @param {*} info
         */
        this.formatDuration = (duration, info) => {
            let base = '2018-01-01', kv
            duration.split(',').forEach(item => {
                item = item.trim()
                kv = item.split(':')
                if (kv.length >= 2) {
                    if (item.toLowerCase().startsWith('duration')) {
                        info.duration = (Date.parse(`${base} ${item.substr(item.indexOf(':') + 1).trim()}`) - Date.parse(`${base} 00:00:00.0`)) / 1000
                    } else {
                        info[kv[0].trim()] = kv[1].trim()
                    }
                }
            })
        }
    }()
}