"use strict";

var fs = require('fs');
var common = require('./../common/common.js');
var moment = require('moment');
var sugar = require('sugar');
var format = '{MM}/{dd}';
var mkpath = require('mkpath');

function getRow(name, location, dates, hashtags, links, overview) {
  var row = '';
  var nameLink = name;
  if (links && links.length > 0 && typeof links !== 'string') {
    nameLink = '[' + name + '](' + links[0] + ')';
  }
  row += common.pad('| ' + nameLink, 100, ' ', null);

  var overviewString = overview;
  if (!overviewString) {
    overviewString = '';
  }
//  row += common.pad('| ' + overviewString, 30, ' ', null);
  row += common.pad('| ' + location, 30, ' ', null);
  row += common.pad('| ' + dates, 20, ' ', null);

  var hashTagString = hashtags;
  if (!hashtags) {
    hashTagString = '';
  } else if (hashtags && hashtags[0].tag && hashtags[0].link) {
    hashTagString = '[' + hashtags[0].tag + '](' + hashtags[0].link + ')';
  }

//  row += common.pad('| ' + hashTagString, 80, ' ', null);

  row += common.pad('| ', 0, ' ', null);
  return row + '\n';
}

function writeMarkdownFromJSON(filename) {
  var obj = JSON.parse(fs.readFileSync(filename, 'utf8'));
  var totalEventCount = 0;
  var rootPath = '../conferences/';
  var summaryMarkdown = '';
  var footer = '\nFor more info, see [this page](https://github.com/minhongrails/events)';

  Object.keys(obj)
    .sort()
    .forEach(function (year) {
      var path = rootPath + year;
      var eventCount = 0;

      mkpath(path, function (err) {
        if (err) throw err;

        var markdown = '';
        markdown += year + ' Conferences\n';
        markdown += '=====================\n\n';

        var events = obj[year];
        events = common.standardizeEventDates(events);
        events = common.sortEvents(events);
        events = common.removeDuplicates(events);

        eventCount += events.length;
        markdown += getRow('Conference Name', 'Location', 'Dates', 'Hash Tag', null, 'Overview');

        // github markdown for text align (https://help.github.com/articles/github-flavored-markdown/)
        markdown += getRow(':--:', ':--:', ':--:', ':--:', ':--:', ':--:');

        for (var i = 0; i < events.length; i++) {
          var event = events[i];
          markdown += getRow(event.name, event.location, event.dates, event.hashTags, event.links, event.overview);
        }

        markdown += '\n(' + eventCount + ' conferences)\n';
        markdown += footer;

        fs.writeFile(path + '/readme.md', markdown, function (err) {
          if (err) {
            return console.log(err);
          }
          totalEventCount += eventCount;
          console.log('Wrote markdown to ' + path + ' with ' + eventCount + ' events, with total of ' + totalEventCount);

          var summaryHeader = 'Conferences\n';
          summaryHeader += '=====================\n\n';
          summaryHeader += 'This is a repository of conferences, mostly tech or design related. [Contributions are welcome!](../contributing.md)\n\n';
          summaryHeader += 'There\'s currently a total of ' + totalEventCount + ' events:\n\n';
          summaryMarkdown += '[' + year + ' (' + eventCount + ' events)](' + year + ')\n\n';
          fs.writeFile(rootPath + '/readme.md', summaryHeader + summaryMarkdown +'\n' + footer, function (err) {
            if (err) {
              return console.log(err);
            }
            console.log('Wrote summary');
          });
        });

      });
    });


}

function convertJSONToMarkdown(folders) {
  common.processFiles(function (filename) {
    if (filename.indexOf('json') > -1) {
      console.log('Converting json ' + filename);
      writeMarkdownFromJSON(filename);
    }
  }, folders);
}


function enrichJSON() {
  var newEvents = [];
  var eventCount = 0;
  common.processFiles(function (filename) {
    if (filename.indexOf('json') > -1) {
      var obj = JSON.parse(fs.readFileSync(filename, 'utf8'));
      for (var year in obj) {
        var events = obj[year];
        eventCount += events.length;

        events = common.standardizeEventDates(events);
        newEvents = newEvents.concat(events);
        newEvents = common.sortEvents(newEvents);
      }
    }
  });
//  console.log('event count: ' + eventCount);
  newEvents = {
    '2015': newEvents
  }
//  console.log(eventCount);
  console.log(JSON.stringify(newEvents));
  return newEvents;
}

module.exports = {
  convertJSONToMarkdown: convertJSONToMarkdown,
  enrichJSON: enrichJSON
}