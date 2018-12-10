const unoconv = require('unoconv-promise')
unoconv
  .run({
    file: '/home/touss/Documents/新智慧党建操作手册.docx',
    output: '/home/touss/Documents/demo.pdf',
  })
  .then(filePath => {
    console.log(filePath)
  })
  .catch(e => {
    console.error(e)
  })

