"use strict";

var fs = require('fs');
var walk = require('walk');
var walker = walk.walk('./data', { followLinks: false });
var obj = {};
var common = require('./common/common.js');
var outFile = './dist/timely.json';

// name
// handle
// info
// startDate
// endDate
// location
// url

walker.on('file', function (root, stat, next) {
  var filename = root + '/' + stat.name;
  var o = JSON.parse(fs.readFileSync(filename, 'utf8'));
  for (var year in o) {
    if (!obj[year]) {
      obj[year] = o[year];
    } else {
      obj[year] = obj[year].concat(o[year]);
    }
  }

  next();
});

walker.on('end', function () {
  debugger;

  // convert to timely's JSON format
  var timelyEvents = [];
  for (var year in obj) {
    var events = obj[year];
    events = common.standardizeEventDates(events);
    events = common.sortEvents(events);
    events = common.removeDuplicates(events);

    for (var i = 0; i < events.length; i++) {
      var event = events[i];
      var eventDates = event.dates.split('-');
      timelyEvents.push({
        name: event.name,
        handle: event.name.trim().toLowerCase().replace(/\s/g, '_'),
        info: event.overview,
        startDate: eventDates[0].trim() + '/' + year,
        endDate: (eventDates[1] ? eventDates[1] : eventDates[0]) + '/' + year,
        location: event.location,
        url: event.links[0]
      });
    }
  }

  fs.writeFile(outFile, JSON.stringify(timelyEvents, null, 4), function (err) {
    if (err) {
      return console.log(err);
    }
    console.log('Generated merged json');
  });


});