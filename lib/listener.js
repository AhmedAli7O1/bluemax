"use strict";


const { debug } = require("./logger");
const urlParser = require("./urlParser");
const { route } = require("./router");

function notFoundHandler (req, res) {
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: "resource not found" }));
}

function requestListener (request, response) {

  // parse path information from the given url
  const { pathname, query } = urlParser(request.url);

  debug(`${request.method} ${pathname} ${JSON.stringify(query)}`);

  // match url with a predefined route handler
  const routeInfo = route(request.method, pathname);

  if (routeInfo) {
    request.params = routeInfo.params;
    request.query = query;
    return routeInfo.handler(request, response);
  }


  notFoundHandler(request, response);
}


module.exports = requestListener;