module.exports = {
    server: {
        port: 3000,
        name: 'File Server'
    },
    path: {
        root: __dirname + '/static',
        other: '/other',
        image: '/images',
        video: '/videos'
    },
    state: {
        success: 'SUCCESS',
        failed: 'FAILED'
    },
    upload: {
        imageAllowFiles: [".png", ".jpg", ".jpeg", ".gif", ".bmp"],
        videoAllowFiles: [
            ".flv", ".swf", ".mkv", ".avi", ".rm", ".rmvb", ".mpeg", ".mpg",
            ".ogg", ".ogv", ".mov", ".wmv", ".mp4", ".webm", ".mp3", ".wav", ".mid"],
        fileAllowFiles: [
            ".png", ".jpg", ".jpeg", ".gif", ".bmp",
            ".flv", ".swf", ".mkv", ".avi", ".rm", ".rmvb", ".mpeg", ".mpg",
            ".ogg", ".ogv", ".mov", ".wmv", ".mp4", ".webm", ".mp3", ".wav", ".mid",
            ".rar", ".zip", ".tar", ".gz", ".7z", ".bz2", ".cab", ".iso",
            ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".pdf", ".txt", ".md", ".xml"
        ],
        imageCatchTimeout: 5000,
        maxSize: 500 * 1024 * 1024,
        fileSize: 500 * 1024 * 1024,
        imageSize: 10 * 1024 * 1024,
        videoSize: 500 * 1024 * 1024,
        imageResizeMinWidth: 320,
        imageResizeScale: 5
    },
    online: {
        allowType: ['audio/ogg', 'audio/mpeg', 'audio/wav', 'video/ogg', 'video/mp4', 'video/webm']
    },
    history: {
        length: 50
    },
    log4js: {
        appenders: {
            console: { type: 'console' },
            runtime: { type: 'dateFile', filename: __dirname + '/logs/runtime.log' }
        },
        categories: {
            default: { appenders: ['console', 'runtime'], level: 'debug' }
        }
    }
}