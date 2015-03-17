"use strict";

var fs = require('fs');
var recursive = require('recursive-readdir');
var outFile = './dist/all.json';
var finalObject = {};

recursive('./data', function (err, files) {
  for (var i = 0; i < files.length; i++) {
    var filename = files[i];
    var o = JSON.parse(fs.readFileSync(filename, 'utf8'));
    var type = filename.split('/')[1];
    for (var year in o) {
      if (!finalObject[year]) {
        finalObject[year] = o[year];
      } else {
        finalObject[year] = finalObject[year].concat(o[year]);
      }

      // give type
      var events = finalObject[year];
      for (var x = 0; x < events.length; x++) {
        events[x].type = type;
      }
    }

  }

  fs.writeFile(outFile, JSON.stringify(finalObject, null, 4), function (err) {
    if (err) {
      return console.log(err);
    }
    console.log('Finished writing ' + outFile);
  });

});

//
//var outFile = './dist/all.json';
//var obj = {};
//var fileOptions = {
//  followLinks: false,
//  listeners: {
//    directories: function (root, directories, next) {
//      debugger;
//      for (var i = 0; i < directories.length; i++) {
//        var directory = root + '/' + directories[i].name;
//        var fileOptions = {
//          followLinks: false,
//          listeners: {
//            file: function (root, file, next) {
//              var type = root.split('/')[2];
//              var filename = root + '/' + file.name;
//              var o = JSON.parse(fs.readFileSync(filename, 'utf8'));
//              for (var year in o) {
//                if (!obj[year]) {
//                  obj[year] = o[year];
//                } else {
//                  obj[year] = obj[year].concat(o[year]);
//                }
//
//                // give type
//                var events = obj[year];
//                for (var i = 0; i < events.length; i++) {
//                  events[i].type = type;
//                }
//              }
//
//              fs.writeFile(outFile, JSON.stringify(obj, null, 4), function (err) {
//                if (err) {
//                  return console.log(err);
//                }
//                console.log('Merged from file ' + filename);
//              });
//              next();
//
//
//            }
//          }
//        }
//        walk.walkSync(directory, fileOptions);
//      }
//    }
//  }
//
//};
//walk.walkSync('./data', fileOptions);

