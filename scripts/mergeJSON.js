"use strict";

var fs = require('fs');
var common = require('./common/common.js');
var sugar = require('sugar');

function mergeJSON(folder) {
  debugger;
  var obj = {};
  common.processFiles(function (filename) {
    if (filename.indexOf('json') > -1) {
      var o = JSON.parse(fs.readFileSync(filename, 'utf8'));
      obj = Object.merge(obj, o, true);
//      console.log(filename + JSON.stringify(obj));
    }
  }, folder);


  // TODO: remove code dup with jsonToMarkdown.js
  for (var i = 0; i < obj; i++) {
    obj[i] = obj[i].sort(function(a, b) {
      if (a.dates < b.dates)
        return -1;
      if (a.dates > b.dates)
        return 1;

      // TODO: if dates are equal then sort by name and other fields?
      return 0;
    });
  }

  console.log(JSON.stringify(obj, null, 4));

}
mergeJSON(['data/2015']);