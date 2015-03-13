#!/bin/sh
node mergeJSON.js > dist/all.json
#node-debug mergeJSON.js > dist/all.json
node main.js > ../conferences/readme.md
