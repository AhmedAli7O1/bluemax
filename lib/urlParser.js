"use strict";

const url = require("url");

function parser (requestUrl) {
  return url.parse(requestUrl, true);
}

module.exports = parser;