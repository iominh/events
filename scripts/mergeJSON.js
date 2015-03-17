"use strict";

var fs = require('fs');
var recursive = require('recursive-readdir');
var outFile = './dist/all.json';
var finalObject = {};
var recursiveReadSync = require('recursive-readdir-sync')

var files = recursiveReadSync('./data');
for (var i = 0; i < files.length; i++) {
  var filename = files[i];
  var o = JSON.parse(fs.readFileSync(filename, 'utf8'));
  for (var year in o) {
    if (!finalObject[year]) {
      finalObject[year] = o[year];
    } else {
      finalObject[year] = finalObject[year].concat(o[year]);
    }

    // give type
    var events = o[year];
    for (var x = 0; x < events.length; x++) {
      var type = filename.split('/')[1];
      events[x].type = type;
//      console.log('Assigned type: ' + type + ' to ' + events[x].name);
    }
  }

}

fs.writeFile(outFile, JSON.stringify(finalObject, null, 4), function (err) {
  if (err) {
    return console.log(err);
  }
  console.log('Finished writing ' + outFile);
});


