"use strict";

const url = require("url");

// TODO: cache url parsing
function parser (requestUrl) {
  return url.parse(requestUrl, true);
}

module.exports = parser;