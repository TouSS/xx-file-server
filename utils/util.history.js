const config = require('../config')

const imageHistory = []
const videoHistory = []
const otherHistory = []

exports.FILE_TYPE_IMAGE = 'image'
exports.FILE_TYPE_VIDEO = 'video'
exports.FILE_TYPE_OTHER = 'other'

let add = (history, file) => {
    file.timestamps = new Date().getTime()
    history.unshift(file)
    if (history.length > config.history.length) {
        history.pop()
    }
}
exports.add = (file, fileType) => {
    if (this.FILE_TYPE_IMAGE == fileType) {
        add(imageHistory, file)
    } else if (this.FILE_TYPE_VIDEO == fileType) {
        add(videoHistory, file)
    } else if (this.FILE_TYPE_OTHER == fileType) {
        add(otherHistory, file)
    }
}

exports.get = (type, start, size) => {
    let history, ret
    if (this.FILE_TYPE_IMAGE == type) {
        history = imageHistory
    } else if (this.FILE_TYPE_VIDEO == type) {
        history = videoHistory
    } else if (this.FILE_TYPE_OTHER == type) {
        history = otherHistory
    } else {
        history = []
    }
    if(start >= history.length) {
        ret = []
    }
    let end = start + size < history.length ? start + size : history.length
    ret = history.slice(start, end)
    return {
        state: config.state.success,
        list: ret,
        start: start,
        total: history.length
    }
}
