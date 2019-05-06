"use strict";


const http = require("http");
const logger = require("./logger");
const IncomingMessage = require("./request");
const ServerResponse = require("./response");
const requestListener = require("./listener");


class Server extends http.Server {
  constructor() {
    super({
      IncomingMessage,
      ServerResponse
    }, requestListener);
  }

  start(options) {
    return new Promise((resolve, reject) => {

      this.listen(options);

      this.on("listening", () => {
        const addr = this.address();
        logger.info(`Server started listening to incoming connections at ${addr.address}:${addr.port}`);
        resolve();
      });

      this.on("error", (error) => {
        if (error.syscall !== "listen") {
          logger.error(error);
          reject(error);
        }
        else {
          switch (error.code) {
            case "EACCES":
              logger.error(`port ${options.port} requires elevated privileges`);
              break;
            case "EADDRINUSE":
              logger.error(`port ${options.port} is already in use`);
              break;
            default:
              logger.error(error.message);
          }

          reject(error);
        }
      });

    });
  }
}

module.exports = Server;
