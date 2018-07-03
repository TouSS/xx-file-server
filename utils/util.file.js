const fs = require("fs")
const path = require("path")
const crypto = require('crypto')
module.exports = () => {
    return new function() {
        /**
         * 递归创建目录
         * @param {*} dir 
         */
        this.mkdirs = (dir) => {
            if (fs.existsSync(dir)) {
                return true;
            } else {
                if (this.mkdirs(path.dirname(dir))) {
                    fs.mkdirSync(dir);
                    return true;
                }
            }
        }
        /**
         * 保存文件
         * @param {*} dir 
         * @param {*} file 
         */
        this.persist = (dir, file) => {
            //计算图片MD5
            let fileBuffer = fs.readFileSync(file.path)
            let type = '.' + file.name.split('.').pop()
            /* let md5 = crypto.createHash('md5')
            md5.update(fileBuffer)
            let md5Hex = md5.digest('hex');
            //文件名（MD5.3/MD5.3/MD5 + 图片后缀）
            let fileName =  md5Hex + '.' + file.name.split('.').pop()
            let relativePath = '/' + md5Hex.substr(0, 3) + '/' + md5Hex.substr(3, 3) + '/' + fileName
            let filePath = dir + relativePath
            //保存文件
            this.mkdirs(path.dirname(filePath))
            fs.writeFileSync(filePath, fileBuffer) */
            let result = this.persistBuffer(dir, fileBuffer, type)
            //移除零时文件
            this.delete(file.path, false)

            /* return {
                name: fileName,
                path: filePath,
                relativePath: relativePath
            } */
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
            /* let size = fileBuffer.length
            let md5 = crypto.createHash('md5')
            md5.update(fileBuffer)
            let md5Hex = md5.digest('hex');
            //文件名（MD5.3/MD5.3/MD5 + 图片后缀）
            let fileName =  md5Hex + type
            let relativePath = '/' + md5Hex.substr(0, 3) + '/' + md5Hex.substr(3, 3) + '/' + fileName
            let filePath = dir + relativePath
            //保存文件
            this.mkdirs(path.dirname(filePath))
            fs.writeFileSync(filePath, fileBuffer)

            return {
                size: size,
                name: fileName,
                path: filePath,
                relativePath: relativePath
            } */
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
            let md5Hex = md5.digest('hex');
            //文件名（MD5.3/MD5.3/MD5 + 图片后缀）
            let fileName =  md5Hex + type
            let relativePath = '/' + md5Hex.substr(0, 3) + '/' + md5Hex.substr(3, 3) + '/' + fileName
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
            if(fs.existsSync(filePath)) {
                fs.unlinkSync(filePath)
                if(clean) {
                    this.deleteEmptyDir(path.dirname(filePath))
                }
                
            }
            
        }
        /**
         * 空目录判断
         * @param {*} dir 
         */
        this.isEmpty = (dir) => {
            return fs.readdirSync(dir).length == 0
        }
        /**
         * 移除空目录
         * @param {*} dir 
         */
        this.deleteEmptyDir = (dir) => {
            if(this.isEmpty(dir)) {
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
            for(let i in fileTypeList) {
                let reg = new RegExp(`^.*\\${fileTypeList[i]}$`)
                if(reg.test(file.name)) {
                    return true
                }
            }
            return false
        }
    } ()
}