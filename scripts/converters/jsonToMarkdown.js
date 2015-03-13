"use strict";

var fs = require('fs');
var common = require('./../common/common.js');
var moment = require('moment');
var sugar = require('sugar');
var format = '{MM}/{dd}';

function printRow(name, location, dates, hashtags, links, overview) {
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
  console.log(row);
}

function printMarkdownFromJSON(filename) {
  var obj = JSON.parse(fs.readFileSync(filename, 'utf8'));
  var eventCount = 0;
  debugger;

  console.log('Conferences');
  console.log('=====================\n');

  Object.keys(obj)
    .sort()
    .forEach(function (year) {
      var events = obj[year];
      events = standardizeEventDates(events);
      events = sortEvents(events);
      events = removeDuplicates(events);

      eventCount += events.length;

      console.log('## ' + year + '\n');
      printRow('Conference Name', 'Location', 'Dates', 'Hash Tag', null, 'Overview');

      // github markdown for text align (https://help.github.com/articles/github-flavored-markdown/)
      printRow(':--:', ':--:', ':--:', ':--:', ':--:', ':--:');

      for (var i = 0; i < events.length; i++) {
        var event = events[i];
        printRow(event.name, event.location, event.dates, event.hashTags, event.links, event.overview);
      }
    });

  console.log('\n(' + eventCount + ' conferences)');
  console.log('\nFor more info, see [this page](https://github.com/minhongrails/events)');
}

function convertJSONToMarkdown(folders) {
  common.processFiles(function (filename) {
    if (filename.indexOf('json') > -1) {
      printMarkdownFromJSON(filename);
    }
  }, folders);
}

function standardizeEventDates(events) {
  for (var i = 0; i < events.length; i++) {
    var event = events[i];
    var split = event.dates.split('-');
    var date1 = Date.create(split[0]);

    if (split.length === 1) {
      // TODO: how do we handle strings like 'April TBD'?
      event.dates = date1.format(format);
    } else if (split.length > 1) {
      // http://sugarjs.com/dates
      var date2 = Date.create(split[1]);

      // if cannot parse, extract day
      if (split[1].length <= 2 || date2.toString() === 'Invalid Date') {
        date2 = Date.create(date1);
        date2.set({ day: split[1]});
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
    for (var x = i+1; x < events.length; x++) {
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

function enrichJSON() {
  var newEvents = [];
  var eventCount = 0;
  common.processFiles(function (filename) {
    if (filename.indexOf('json') > -1) {
      var obj = JSON.parse(fs.readFileSync(filename, 'utf8'));
      for (var year in obj) {
        var events = obj[year];
        eventCount += events.length;

        events = standardizeEventDates(events);
        newEvents = newEvents.concat(events);
        newEvents = sortEvents(newEvents);
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