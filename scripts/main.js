"use strict";

//require('./converters/markdownToJSON.js').processMarkdownFiles();

//require('./converters/jsonToMarkdown.js').convertJSONToMarkdown();

//require('./converters/htmlToJSON.js').convertHTMLToJSON();

require('./converters/jsonToMarkdown.js').convertJSONToMarkdown(['dist']);

//require('./converters/jsonToMarkdown.js').enrichJSON();
