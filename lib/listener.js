"use strict";


const { debug } = require("./logger");
const urlParser = require("./urlParser");

function notFoundHandler (req, res) {
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: "resource not found" }));
}

function requestListener (request, response, match) {
  const { pathname, query } = urlParser(request.url);

  debug(`${request.method} ${pathname} ${JSON.stringify(query)}`);

  const routeInfo = match(request.method, pathname);

  if (routeInfo) {
    request.params = routeInfo.params;
    request.query = query;
    routeInfo.handler(request, response);
  }
  else {
    notFoundHandler(request, response);
  }
}

module.exports = requestListener;