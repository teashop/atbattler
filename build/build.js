var stitch = require('stitch');
var fs = require('fs');
var path = require('path');

var srcPath = path.normalize(__dirname + '/../src');
var depsPath = path.normalize(__dirname + '/../lib');
var outputFile = path.normalize(__dirname + '/../dist/atb.js');
var jsPackage = stitch.createPackage({
  paths: [depsPath, srcPath]
});


//console.log(__dirname + '/assets/js');
//console.log(process.platform);

jsPackage.compile(function (err, source){
  fs.writeFile(outputFile, source, function (err) {
    if (err) throw err;
    console.log('Compiled ' + outputFile);
  })
})
