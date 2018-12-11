var im = require('imagemagick')

im.convert(['-density','150','-antialias', '/home/touss/Documents/demo.ps', '-quality', '100', '/home/touss/Documents/imgs/%03d.png'], 
function(err, stdout){
  if (err) throw err;
  console.log('stdout:', stdout);
})