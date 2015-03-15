"use strict";

var fs = require('fs');
var walk = require('walk');
var walker = walk.walk('./data', { followLinks: false });
var obj = {};
var outFile = './dist/all.json';

walker.on('file', function (root, stat, next) {
  var filename = root + '/' + stat.name;
  var o = JSON.parse(fs.readFileSync(filename, 'utf8'));
  for (var year in o) {
    if (!obj[year]) {
      obj[year] = o[year];
    } else {
      obj[year] = obj[year].concat(o[year]);
    }
  }

  fs.writeFile(outFile, JSON.stringify(obj, null, 4), function (err) {
    if (err) {
      return console.log(err);
    }
    console.log('Merged from file ' + filename);
  });

  next();
});

//walker.on('end', function () {
////  console.log('Finished merging');
//});