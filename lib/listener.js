"use strict";


const { debug } = require("./logger");
const urlParser = require("./urlParser");
const { route } = require("./router");


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

  response.notFound("resource not found");
}


module.exports = requestListener;