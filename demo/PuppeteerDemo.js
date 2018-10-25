const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ 
    headless: true, 
    defaultViewport: { width: 1920, height: 1080 },
    //executablePath: 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe' 
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