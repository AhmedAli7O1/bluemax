"use strict";


const urlParser = require("./urlParser");
const { route } = require("./router");


function requestListener (request, response) {
  // parse path information from the given url
  const { pathname, query } = urlParser(request.url);

  request.path = pathname;
  request.query = query;

  // match url with a predefined route handler
  const routeInfo = route(request.method, pathname);

  if (routeInfo) {
    request.params = routeInfo.params;
    routeInfo.handler(request, response);
  }
  else {
    response.notFound("resource not found");
  }
}


module.exports = requestListener;
