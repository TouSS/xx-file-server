const fs = require("fs")

const config = require('../config')

module.exports = {
    get: (name) => {
        let fonts = fs.readdirSync(config.font.dir)
        for (let i = 0; i < fonts.length; i++) {
            if (fonts[i].indexOf(name) >= 0) {
                return config.font.dir + '/' + fonts[i]
            }
        }
        return null
    }
}