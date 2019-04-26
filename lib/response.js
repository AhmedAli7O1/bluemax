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

  header(name, value) {
    this.setHeader(name, value);
    return this;
  }

  status(statusCode) {
    this.statusCode = statusCode;
    return this;
  }

  json(data) {
    this
      .header('Content-Type', 'application/json')
      .end(JSON.stringify(data));
  }

  badRequest(message) {
    this
      .status(400)
      .json({ message });
  }

  notFound(message) {
    this
      .status(404)
      .json({ message });
  }

  internalError(message) {
    this
      .status(500)
      .json({ message });
  }
}

module.exports = ServerResponse;