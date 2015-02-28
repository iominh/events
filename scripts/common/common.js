"use strict";

var fs = require('fs');

function processFiles(callback, folders) {
  if (!folders) {
    folders = ['data'];
  }
  for (var i = 0; i < folders.length; i++) {
    var path = './' + folders[i];
    var files = fs.readdirSync(path);
    for (var x = 0; x < files.length; x++) {
      callback(path + '/' + files[x]);
    }
  }
}

/**
 *
 *  Javascript string pad
 *  http://www.webtoolkit.info/
 *
 **/
var STR_PAD_LEFT = 1;
var STR_PAD_RIGHT = 2;
var STR_PAD_BOTH = 3;

function pad(str, len, pad, dir) {

  if (typeof(len) == "undefined") {
    var len = 0;
  }
  if (typeof(pad) == "undefined") {
    var pad = ' ';
  }
  if (typeof(dir) == "undefined") {
    var dir = STR_PAD_RIGHT;
  }

  if (len + 1 >= str.length) {

    switch (dir) {

      case STR_PAD_LEFT:
        str = Array(len + 1 - str.length).join(pad) + str;
        break;

      case STR_PAD_BOTH:
        var right = Math.ceil((padlen = len - str.length) / 2);
        var left = padlen - right;
        str = Array(left + 1).join(pad) + str + Array(right + 1).join(pad);
        break;

      default:
        str = str + Array(len + 1 - str.length).join(pad);
        break;

    } // switch

  }

  return str;

}

function tidyString(text) {
  return removeExtraWhitespace(removeExtraLines(text));
}

function removeExtraLines(text) {
  return text.replace(/\n|\r/g, "");
}

function removeExtraWhitespace(text) {
  return text.replace(/\s{2,}/g, ' ');
}

function mergeObjects(obj1, obj2) {

  for (var p in obj2) {
    try {
      // Property in destination object set; update its value.
      if ( obj2[p].constructor==Object ) {
        obj1[p] = mergeObjects(obj1[p], obj2[p]);

      } else {
        obj1[p] = obj2[p];

      }

    } catch(e) {
      // Property in destination object not set; create it and set its value.
      obj1[p] = obj2[p];

    }
  }
  return obj1;
}

module.exports = {
  processFiles: processFiles,
  pad: pad,
  tidyString: tidyString,
  mergeObjects: mergeObjects
}