const phantom = require('phantom');
const cheerio = require('cheerio');

(async function () {
  const instance = await phantom.create();
  const page = await instance.createPage();
  page.on('onResourceRequested', function(requestData) {
    //console.info('Requesting', requestData);
  });
  page.on('onError ', function (msg, trace) {
    let msgStack = ['ERROR: ' + msg];
    if (trace && trace.length) {
      msgStack.push('TRACE:');
      trace.forEach(function (t) {
        msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function + '")' : ''));
      });
    }
    console.error(msgStack.join('\n'));
  });
  let status = await page.open('http://192.168.1.8/view/27982');
  let content = await page.property('content');
  console.log(content)
  //let $ = cheerio.load(content);

  //console.log($('link').attr('href'));

  await instance.exit();

  let index = {
    entry: 'http://qjwb.zjol.com.cn/html/2018-09/21/node_77.htm',
    type: 'url#string',
    content: {
      plates: {
        entry: '.main-ednav-nav dl dt a',
        type: 'url#selector',
        content: {
          name: {
            type: 'object#property',
            selector: '.main-ed-pageifm span'
          },
          news: {
            entry: '.main-ed-map area',
            type: 'url#selector',
            content: {
              pretitle: {
                type: 'object#property',
                selector: '.main-article-content .main-article-pretitle'
              },
              title: {
                type: 'object#property',
                selector: '.main-article-content .main-article-title'
              },
              subtitle: {
                type: 'object#property',
                selector: '.main-article-content .main-article-subtitle'
              },
              pictrues: {
                type: 'array#property',
                selector: '.main_ar_pic_text table tbody'
              },
              text: {
                type: 'object#property',
                selector: '.main-article-con founder-content'
              }
            }
          }
        }
      }
    }
  }

})();