const os = require('os')
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const unoconv = require('unoconv-promise')

const log = require('./util.log').getLogger()

module.exports = () => {
  return new function() {
    /**
     * 递归创建目录
     * @param {*} dir
     */
    this.mkdirs = dir => {
      if (fs.existsSync(dir)) {
        return true
      } else {
        if (this.mkdirs(path.dirname(dir))) {
          fs.mkdirSync(dir)
          return true
        }
      }
    }
    /**
     * 写文件到指定目录
     * @param {*} dir
     * @param {*} file
     */
    this.write = (dir, file) => {
      let filePath = dir + '/' + file.name
      this.mkdirs(path.dirname(filePath))
      fs.writeFileSync(filePath, fs.readFileSync(file.path))
    }
    /**
     * 保存文件(已MD5命名)
     * @param {*} dir
     * @param {*} file
     */
    this.persist = (dir, file) => {
      //计算图片MD5
      let fileBuffer = fs.readFileSync(file.path)
      let type = '.' + file.name.split('.').pop()
      let result = this.persistBuffer(dir, fileBuffer, type)
      //移除零时文件
      this.delete(file.path, false)
      return result
    }
    /**
     * 结构并保存Base64字符文件
     * @param {*} dir
     * @param {*} base64Str
     * @param {*} type
     */
    this.persistBase64 = (dir, base64Str, type) => {
      let fileBuffer = Buffer.from(base64Str, 'base64')
      return this.persistBuffer(dir, fileBuffer, type)
    }
    /**
     * 处理文件Buffer内容
     * @param {*} dir
     * @param {*} buffer
     * @param {*} type
     */
    this.persistBuffer = (dir, buffer, type) => {
      let size = buffer.length
      let md5 = crypto.createHash('md5')
      md5.update(buffer)
      let md5Hex = md5.digest('hex')
      //文件名（MD5.3/MD5.3/MD5 + 图片后缀）
      let fileName = md5Hex + type
      let relativePath =
        '/' + md5Hex.substr(0, 3) + '/' + md5Hex.substr(3, 3) + '/' + fileName
      let filePath = dir + relativePath
      //保存文件
      this.mkdirs(path.dirname(filePath))
      fs.writeFileSync(filePath, buffer)

      return {
        size: size,
        name: fileName,
        path: filePath,
        relativePath: relativePath
      }
    }
    /**
     * 移除文件
     * @param {*} filePath
     * @param {*} clean 是否清理目录
     */
    this.delete = (filePath, clean) => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
        if (clean) {
          this.deleteEmptyDir(path.dirname(filePath))
        }
      }
    }
    /**
     * 空目录判断
     * @param {*} dir
     */
    this.isEmpty = dir => {
      return fs.readdirSync(dir).length == 0
    }
    /**
     * 移除空目录
     * @param {*} dir
     */
    this.deleteEmptyDir = dir => {
      if (this.isEmpty(dir)) {
        fs.rmdirSync(dir)
        this.deleteEmptyDir(path.dirname(dir))
      }
    }
    /**
     * 判断是否为指定文件类型
     * @param {*} fileTypeList
     * @param {*} file
     */
    this.isRightFile = (fileTypeList, file) => {
      for (let i in fileTypeList) {
        let reg = new RegExp(`^.*\\${fileTypeList[i]}$`)
        if (reg.test(file.name.toLowerCase())) {
          return true
        }
      }
      return false
    }

    /**
     * 文件列表
     * @param {*} dir
     */
    this.list = dir => {
      return fs.readdirSync(dir)
    }

    /**
     * Office文件转化为可预览文件PDF/HTML
     */
    this.convertOfficeFile = async (name, path) => {
      if (!name || !path) return
      let targetFileName = this.getTargetFileName(name)
      if (!targetFileName) return
      let targetPath = `${os.tmpdir()}/${targetFileName}`
      if (fs.existsSync(targetPath)) return targetFileName
      try {
        await unoconv.run({
          file: path,
          output: targetPath
        })
      } catch (e) {
        log.warn(`Office文件预览转换，Warn:${e.toString()}`)
      }
      if (fs.existsSync(targetPath)) return targetFileName
      return
    }

    /**
     * 预览目标文件名
     */
    this.getTargetFileName = sourceFileName => {
      let suffix = sourceFileName.split('.')[1]
      if (!suffix) return
      switch (suffix) {
        case 'xls':
        case 'xlsx':
          return sourceFileName.replace(`.${suffix}`, '.html')
        case 'doc':
        case 'docx':
        case 'ppt':
        case 'pptx':
          return sourceFileName.replace(`.${suffix}`, '.pdf')
        default:
          return
      }
    }
  }()
}
