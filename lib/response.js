"use strict";

/*

sendJson
sendText
sendFile

badRequest
internalError

statusCode / setCode
setHeader

res
  .setHeader("", "")
  .setHeader("", "")
  .status(500)
  .sendJson({ name: "test" })

 */

const http = require("http");

class ServerResponse extends http.ServerResponse {
  send (data) {
    this.writeHead(200, { 'Content-Type': 'application/json' });
    this.end(JSON.stringify(data));
  }
}

module.exports = ServerResponse;