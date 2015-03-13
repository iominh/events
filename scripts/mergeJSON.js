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
      for (var year in o) {
        if (!obj[year]) {
          obj[year] = o[year];
        } else {
          obj[year] = obj[year].concat(o[year]);
        }
      }

    }
  }, folder);

  console.log(JSON.stringify(obj, null, 4));

}
mergeJSON(['data/2015']);