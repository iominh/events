"use strict";

var fs = require('fs');
var recursive = require('recursive-readdir');
var outFile = './dist/timely.json';
var finalObject = {};
var timelyEvents = [];
var recursiveReadSync = require('recursive-readdir-sync')
var common = require('./common/common.js');

var files = recursiveReadSync('./data');
for (var i = 0; i < files.length; i++) {
  var filename = files[i];
  var o = JSON.parse(fs.readFileSync(filename, 'utf8'));
  for (var year in o) {
    if (!finalObject[year]) {
      finalObject[year] = o[year];
    } else {
      finalObject[year] = finalObject[year].concat(o[year]);
    }

    var events = o[year];
    events = common.standardizeEventDates(events);
    events = common.sortEvents(events);
    events = common.removeDuplicates(events);

    for (var x = 0; x < events.length; x++) {
      var type = filename.split('/')[1];
      var event = events[x];
      var eventDates = events[x].dates.split('-');
      var startDate = eventDates[0].trim();
      timelyEvents.push({
        name: event.name,
        handle: event.name.trim().toLowerCase().replace(/\s/g, '_'),
        info: event.overview,
        startDate: startDate + '/' + year,
        endDate: ( eventDates[1] ? eventDates[1].trim() : startDate) + '/' + year,
        location: event.location,
        url: event.links[0],
        type: type
      });

    }
    timelyEvents.push[events];
  }

}

fs.writeFile(outFile, JSON.stringify(timelyEvents, null, 4), function (err) {
  if (err) {
    return console.log(err);
  }
  console.log('Finished writing ' + outFile);
});


