"use strict";

var fs = require('fs');
var common = require('./../common/common.js');
var moment = require('moment');
var sugar = require('sugar');


function printRow(name, location, dates, hashtags, links, overview) {
  var row = '';
  var nameLink = name;
  if (links && links.length > 0 && typeof links !== 'string') {
    nameLink = '[' + name + '](' + links[0] + ')';
  }
  row += common.pad('| ' + nameLink, 60, ' ', null);

  var overviewString = overview;
  if (!overviewString) {
    overviewString = '';
  }
  row += common.pad('| ' + overviewString, 30, ' ', null);
  row += common.pad('| ' + location, 30, ' ', null);
  row += common.pad('| ' + dates, 20, ' ', null);

  var hashTagString = hashtags;
  if (!hashtags) {
    hashTagString = '';
  } else if (hashtags && hashtags[0].tag && hashtags[0].link) {
    hashTagString = '[' + hashtags[0].tag + '](' + hashtags[0].link + ')';
  }

  row += common.pad('| ' + hashTagString, 80, ' ', null);

  row += common.pad('| ', 0, ' ', null);
  console.log(row);
}

function printMarkdownFromJSON(filename) {
  var obj = JSON.parse(fs.readFileSync(filename, 'utf8'));
  debugger;

  console.log('Conferences');
  console.log('=====================\n');

  Object.keys(obj)
    .sort()
    .forEach(function (year) {
      var yearEvents = obj[year];

      console.log('## ' + year + '\n');
      printRow('Conference Name', 'Location', 'Dates', 'Hash Tag', null, 'Overview');

      // github markdown for text align (https://help.github.com/articles/github-flavored-markdown/)
      printRow(':--:', ':--:', ':--:', ':--:', ':--:', ':--:');

      for (var i = 0; i < yearEvents.length; i++) {
        var event = yearEvents[i];
        printRow(event.name, event.location, event.dates, event.hashTags, event.links, event.overview);
      }
    });

  console.log('\nFor more info, see [this page](https://github.com/minhongrails/events)');
}

function convertJSONToMarkdown(folders) {
  common.processFiles(function (filename) {
    if (filename.indexOf('json') > -1) {
      printMarkdownFromJSON(filename);
    }
  }, folders);
}

function enrichJSON() {
  debugger;
  var json = [];
  common.processFiles(function (filename) {
    if (filename.indexOf('json') > -1) {
      var obj = JSON.parse(fs.readFileSync(filename, 'utf8'));
      for (var year in obj) {
        var events = obj[year];

        // standardize the dates
        for (var i = 0; i < events.length; i++) {
          var event = events[i];
          var split = event.dates.split('-');

          if (split.length > 0) {
            // http://sugarjs.com/dates
            var date1 = Date.create(split[0]);
            var date2 = Date.create(split[1]);

            // if cannot parse, extract day
            if (date2.toString() === 'Invalid Date') {
              date2 = Date.create(date1);
              date2.set({ day: split[1] });
            }
            event.dates = date1.format('{M}.{d}') + ' - ' + date2.format('{M}.{d}');
          }
        }
        json = json.concat(events);
      }
    }
  });
  console.log(JSON.stringify(json));
  return json;
}

module.exports = {
  convertJSONToMarkdown: convertJSONToMarkdown,
  enrichJSON: enrichJSON
}