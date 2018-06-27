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
        success: 'success',
        failed: 'failed'
    },
    upload: {
        maxSize: 500 * 1024 * 1024,
        fileSize: 500 * 1024 * 1024,
        imageSize: 10 * 1024 * 1024,
        videoSize: 500 * 1024 * 1024
    }
}