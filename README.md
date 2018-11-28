# xx-file-server
A simple picture server

# require
ffmpeg: Make sure you have [ffmpeg](http://www.ffmpeg.org) installed on your system (including all necessary encoding libraries like libmp3lame or libx264)

Puppeteer: Node 库，它提供了一个高级 API 来通过 DevTools 协议控制 Chromium 或 Chrome。 [安装问题](https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md)
CENTOS：
    会使用到Chromium 或 Chrome多以需要安装依赖： CENTOS： yum install pango.x86_64 libXcomposite.x86_64 libXcursor.x86_64 libXdamage.x86_64 libXext.x86_64 libXi.x86_64 libXtst.x86_64 cups-libs.x86_64 libXScrnSaver.x86_64 libXrandr.x86_64 GConf2.x86_64 alsa-lib.x86_64 atk.x86_64 gtk3.x86_64 ipa-gothic-fonts xorg-x11-fonts-100dpi xorg-x11-fonts-75dpi xorg-x11-utils xorg-x11-fonts-cyrillic xorg-x11-fonts-Type1 xorg-x11-fonts-misc

    字体：
        yum install ipa-gothic-fonts xorg-x11-fonts-100dpi xorg-x11-fonts-75dpi xorg-x11-utils xorg-x11-fonts-cyrillic xorg-x11-fonts-Type1 xorg-x11-fonts-misc
        yum install wqy-unibit-fonts.noarch wqy-zenhei-fonts.noarch

    使用时使用 puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] }) 不使用沙箱 安全性降低 安装配置 简化

注：Chromium下载失败时可以使用淘宝镜像进行下载， npm config set puppeteer_download_host=https://npm.taobao.org/mirrors