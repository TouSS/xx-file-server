const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ 
    headless: false, 
    defaultViewport: { width: 1920, height: 1080 },
    /* 选择本地安装的谷歌浏览器 */
    executablePath: '/opt/google/chrome/chrome' 
  });
  const page = await browser.newPage();
  /* page.on('request', request => {
    console.error('---------------------------REQ---------------------------')
    console.log(request)
  }) */

  /* page.on('response', response => {
    console.error('---------------------------RESP---------------------------')
    console.log(response)
  }) */
  await page.goto('https://www.google.com');
  setTimeout(async () => {
    await page.screenshot({ path: './demo/screenshot.png'});
    await browser.close();
  }, 5000)


})();