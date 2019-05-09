"use strict";


const url = require("url");


class Listener {

  constructor(match) {
    this.match = match;
  }

  requestListener(request, response) {
    // parse path information from the given url
    const { pathname, query } = url.parse(request.url, true);

    request.path = pathname;
    request.query = query;

    // match url with a predefined route handler
    const routeInfo = this.match(request.method, pathname);

    if (routeInfo) {
      request.params = routeInfo.params;
      routeInfo.handler(request, response);
    }
    else {
      response.notFound("resource not found");
    }
  }
}


module.exports = Listener;
