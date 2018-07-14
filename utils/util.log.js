/* const log4js = require('log4js')

const config = require('../config')

log4js.configure(config.log4js)

module.exports = log4js */

/**
 * PM2多节点运行时log4js支持不好,暂时使用自定义日志输出
 * @param {*} category 
 */
exports.getLogger = category => {
    category = category || 'default'
    return {
        debug: msg => {
            console.debug(`[${new Date().toLocaleString()}] [DEBUG] ${category} - ${msg}`)
        },
        info: msg => {
            console.info(`[${new Date().toLocaleString()}] [INFO] ${category} - ${msg}`)
        },
        warn: msg => {
            console.warn(`[${new Date().toLocaleString()}] [WARN] ${category} - ${msg}`)
        },
        error: msg => {
            console.error(`[${new Date().toLocaleString()}] [ERROR] ${category} - ${msg}`)
        }
    }
}