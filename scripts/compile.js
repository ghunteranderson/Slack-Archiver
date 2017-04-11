var fs = require('fs');
const uglifyjs = require('uglify-js');

var files = fs.readdirSync('./src')
var paths = []
files.forEach(function(file){
  paths.push('./src/' + file.toString());
});

var stream = fs.createWriteStream("Code.gs");
stream.once('open', function(fd) {
  paths.forEach(function(path){
    stream.write(uglifyjs.minify(path).code);
    stream.write('\r\n');
  });
});
