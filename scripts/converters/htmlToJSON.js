"use strict";

var fs = require('fs');
var readline = require('readline');
var stream = require('stream');
var common = require('./../common/common.js');
var htmlparser = require("htmlparser2");

function printJSONFromHTML(filePath) {
//  console.log('processing html ' + filePath);
}

function convertHTMLToJSON() {
  common.processFiles(function(filePath) {
    if (filePath.indexOf('html') > -1) {
      printJSONFromHTML(filePath);
    }
  });
}

module.exports = {
  convertHTMLToJSON: convertHTMLToJSON
}