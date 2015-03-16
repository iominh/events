"use strict";

var sugar = require('sugar');
var fs = require('fs');
var format = '{MM}/{dd}';

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
      if (obj2[p].constructor == Object) {
        obj1[p] = mergeObjects(obj1[p], obj2[p]);

      } else {
        obj1[p] = obj2[p];

      }

    } catch (e) {
      // Property in destination object not set; create it and set its value.
      obj1[p] = obj2[p];

    }
  }
  return obj1;
}

// TODO: is there a generic NLP library for extracting dates?
// handles dates like:
// February 6-7, 2014
// March 13-17
// 1/22 - 1/23
// April 13-18th
// March 28-29, 2014 April 25-26, 2014 May 9-10, 2014
// 1/12 - 1/16
function standardizeEventDates(events) {
  for (var i = 0; i < events.length; i++) {
    var event = events[i];
    // sanitize
    var split = event.dates.replace('th', '');
    split = split.split('-');
    if (split.length === 1) {
      split = event.dates.split('–');
    }
    var date1 = Date.create(split[0]);

    if (split.length === 1) {
      // TODO: how do we handle strings like 'April TBD'?
      event.dates = date1.format(format);
    } else if (split.length > 1) {
      var split2 = tidyString(split[1]).trim();
      var date2 = Date.create(split2);
      var splitDayYear = null;

      // if second date has a year, strip it off like '7, 2014' or '7 2014' --> split2 = [7, 2014]
      if (date2.toString() === 'Invalid Date') {
        splitDayYear = split2.split(',');
        if (splitDayYear.length > 1) {
          date2 = Date.create(splitDayYear[0]);
        } else {
          splitDayYear = split2.split(' ');
          if (splitDayYear.length > 1) {
            date2 = Date.create(splitDayYear[0]);
          }
        }
      }

      // http://sugarjs.com/dates
      // for second date, use the first date's month with the second date's day
      if (split2.length <= 2 || date2.toString() === 'Invalid Date' ||
        (splitDayYear && splitDayYear[0].length <= 2)) {
        date2 = Date.create(date1);
        if (splitDayYear > 0) {
          date2.set({ day: split[1]});
        } else {
          if (!splitDayYear) {
            date2.set({ day: split2});
          } else {
            date2.set({ day: splitDayYear[0]});
          }

        }

      }
      event.dates = date1.format(format) + ' - ' + date2.format(format);
    }
  }
  return events;
}

function removeDuplicates(events) {
  var nonDuplicatedArray = [];
  for (var i = 0; i < events.length; i++) {
    var isDuplicate = false;
    // look ahead for duplicates. if found, don't add
    for (var x = i + 1; x < events.length; x++) {
      if (Object.equal(events[x], events[i])) {
        isDuplicate = true;
        break;
      }
    }
    if (!isDuplicate) {
      nonDuplicatedArray.push(events[i]);
    }
  }
  return nonDuplicatedArray;
}

// sort events by start date
function sortEvents(events) {
  // TODO: add secondary sort condition?
  return events.sort(function (a, b) {
    if (a.dates < b.dates)
      return -1;
    if (a.dates > b.dates)
      return 1;
    return 0;
  });
}

module.exports = {
  processFiles: processFiles,
  pad: pad,
  tidyString: tidyString,
  mergeObjects: mergeObjects,
  standardizeEventDates: standardizeEventDates,
  removeDuplicates: removeDuplicates,
  sortEvents: sortEvents
}