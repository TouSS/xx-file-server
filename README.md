# xx-file-server
A simple file server

# require
## 视频处理
ffmpeg: Make sure you have [ffmpeg](http://www.ffmpeg.org) installed on your system (including all necessary encoding libraries like libmp3lame or libx264)

## 网页截图
[Puppeteer](https://zhaoqize.github.io/puppeteer-api-zh_CN/#/): Node 库，它提供了一个高级 API 来通过 DevTools 协议控制 Chromium 或 Chrome。 [安装问题](https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md)
### CENTOS：
    会使用到Chromium 或 Chrome多以需要安装依赖： CENTOS： yum install pango.x86_64 libXcomposite.x86_64 libXcursor.x86_64 libXdamage.x86_64 libXext.x86_64 libXi.x86_64 libXtst.x86_64 cups-libs.x86_64 libXScrnSaver.x86_64 libXrandr.x86_64 GConf2.x86_64 alsa-lib.x86_64 atk.x86_64 gtk3.x86_64 ipa-gothic-fonts xorg-x11-fonts-100dpi xorg-x11-fonts-75dpi xorg-x11-utils xorg-x11-fonts-cyrillic xorg-x11-fonts-Type1 xorg-x11-fonts-misc

    字体：
        yum install ipa-gothic-fonts xorg-x11-fonts-100dpi xorg-x11-fonts-75dpi xorg-x11-utils xorg-x11-fonts-cyrillic xorg-x11-fonts-Type1 xorg-x11-fonts-misc
        yum install wqy-unibit-fonts.noarch wqy-zenhei-fonts.noarch

    使用时使用 puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] }) 不使用沙箱 安全性降低 安装配置 简化
### Debian (e.g. Ubuntu) Dependencies
    gconf-service
    libasound2
    libatk1.0-0
    libatk-bridge2.0-0
    libc6
    libcairo2
    libcups2
    libdbus-1-3
    libexpat1
    libfontconfig1
    libgcc1
    libgconf-2-4
    libgdk-pixbuf2.0-0
    libglib2.0-0
    libgtk-3-0
    libnspr4
    libpango-1.0-0
    libpangocairo-1.0-0
    libstdc++6
    libx11-6
    libx11-xcb1
    libxcb1
    libxcomposite1
    libxcursor1
    libxdamage1
    libxext6
    libxfixes3
    libxi6
    libxrandr2
    libxrender1
    libxss1
    libxtst6
    ca-certificates
    fonts-liberation
    libappindicator1
    libnss3
    lsb-release
    xdg-utils
    wget

注：Chromium下载失败时可以使用淘宝镜像进行下载， npm config set puppeteer_download_host=https://npm.taobao.org/mirrors

## Office文件预览
基于LibreOffice, 调用LibreOffice文档转换
[Unoconv](http://dag.wieers.com/home-made/unoconv/) is required
[LibreOffice (or OpenOffice.)](https://www.libreoffice.org/) is required
[imagemagick](https://www.imagemagick.org/script/index.php) is required

### LibreOffice Centos7安装
yum remove openoffice* libreoffice* 卸载旧版本
[下载](https://www.libreoffice.org/download/download/)最新版本LibreOffice
解压下载文件
安装，进入到的RPMS目录执行 yum localinstall *.rpm
### Unoconv Centos7安装
git clone https://github.com/dagwieers/unoconv.git (需要安装[python](https://www.python.org/))
ln -s unoconv/unoconv /usr/bin/unoconv 全局访问

###Ubuntu18安装
LibreOffice： 安装自带LibreOffice
Unoconv： sudo apt install unoconv

## 问题
### 安装问题
Q: node-pre-gyp: Permission denied
A: npm config set user 0
   npm config set unsafe-perm true

### 软件包问题
Q: 使用imagemagick时出现 convert:not authorized
A: 修改/etc/ImageMagick-6/policy.xml配置文件，如<policy domain="coder" rights="read|write" pattern="PDF" /> rights： none -> read|write 添加该文件类型权限
