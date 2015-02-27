"use strict";

var fs = require('fs');
var readline = require('readline');
var stream = require('stream');
var common = require('./../common/common.js');

function parseLink(str) {
  var nameStart, nameEnd;
  var linkStart, linkEnd;
  // TODO: handle escaped characters
  for (var x = 0; x < str.length; x++) {
    if (str[x] === '[') {
      nameStart = x + 1;
    } else if (str[x] === ']') {
      nameEnd = x;
    } else if (str[x] === '(') {
      linkStart = x + 1;
      1
    } else if (str[x] === ')') {
      linkEnd = x;
    }
  }
  return {
    name: str.substring(nameStart, nameEnd),
    link: str.substring(linkStart, linkEnd)
  }
}

function printJSONFromMarkdown(filename) {
  var instream = fs.createReadStream(filename);
  var outstream = new stream;
  var rl = readline.createInterface(instream, outstream);

  var foundTable = false;
  var tableRow = 0;
  var json = {
    2015: []
  }
  var obj = {};
  rl.on('line', function (line) {

    var split = line.split('|');
    if (split.length > 1) {
      foundTable = true;
      tableRow++;

      // skip table headers
      if (tableRow > 2) {
        for (var i = 1; i < split.length; i++) {
          var cell = split[i].trim();
          switch (i) {
            case 1:
              var cellSplit = parseLink(cell);
              obj.name = cellSplit.name;
              obj.links = [ cellSplit.link ];
              break;
            case 2:
              obj.location = cell;
              break;
            case 3:
              obj.dates = cell;
              break;
            case 4:
              var cellSplit = parseLink(cell);
              obj.hashTags = [
                {
                  tag: cellSplit.name,
                  link: cellSplit.link
                }
              ];
              json['2015'].push(obj);
              obj = {};
              break;
          }
        }
      }

    } else {
      foundTable = false;
      tableRow = 0;
    }
  });

  rl.on('close', function () {
    console.log(JSON.stringify(json))
  });

}

function processMarkdownFiles() {
  common.processFiles(function(filePath) {
    printJSONFromMarkdown(filePath);
  });
}

module.exports = {
  processMarkdownFiles : processMarkdownFiles
}