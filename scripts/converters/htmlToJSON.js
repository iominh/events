"use strict";

var fs = require('fs');
var readline = require('readline');
var stream = require('stream');
var common = require('./../common/common.js');
var htmlparser = require("htmlparser2");
var cheerio = require('cheerio');


function printJSONFromHTML(filePath) {
  var htmlString = fs.readFileSync(filePath, "utf8");
  var $ = cheerio.load(htmlString);
  var table = $('.tablesorter');
  debugger;
  var events = [];
  var rows = table.find('> tbody > tr');
  for (var i = 0; i < rows.length; i++) {

    var cols = $(rows[i]).find('td');
    var obj = {};

    for (var x = 0; x < cols.length; x++) {
      var col = $(cols[x]);
      var text = col.text().trim();
      text = common.tidyString(text);

      switch (x) {
        // name
        case 0:
          var link = col.find('a');
          if (link) {
            link = link.attr('href');
          }
          obj.name = text;
          obj.links = [link];
          break;
        // focus
        case 1:
          obj.overview = text;
          break;
        case 2:
          obj.location = text;
          break;
        case 3:
          obj.dates = text;
          break;
        case 4:
          events.push(obj);
          obj = {};
          break;
      }


    }
  }
  console.log(JSON.stringify(events));

}

function convertHTMLToJSON() {
  common.processFiles(function (filePath) {
    if (filePath.indexOf('html') > -1) {
      printJSONFromHTML(filePath);
    }
  });
}

module.exports = {
  convertHTMLToJSON: convertHTMLToJSON
}