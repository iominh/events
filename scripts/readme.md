# Scripts

These are some helper scripts for converting between various data formats (json + markdown)

```javascript
# Run parser that will read the parent dirs to output some json
node main.js

# Same command except through npm
npm start
```

# Debug help

[Node-inspector](https://github.com/node-inspector/node-inspector) is awesome. After installing it, run

```
node-debug main.js
```

# Some notes

To convert the Cocoa Conferences markdown, I used the following regex in Sublime Text 3 to convert from Markdown to
the JSON format I'm using:


```sh
\* \[(.*)\]\((.*)\) \| \*\*(.*)\*\* \| (.*)

{
	"name": "$1",
	"links": ["$2"],
	"overview": "",
	"location": "$4",
	"dates": "$3"
},
```


To convert the hackathon-calendar, I used the folowing regex

```sh
\| \[(.*)\]\((.*)\) \| (.*) \| (.*) \|

{
	"name": "$1",
	"links": ["$2"],
	"overview": "",
	"location": "$3",
	"dates": "$4"
},
```