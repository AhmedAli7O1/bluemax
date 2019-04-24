"use strict";


const http = require("http");
const logger = require("./logger");
const IncomingMessage = require("./request");
const ServerResponse = require("./response");


async function createServer (requestListener, options) {
  return new Promise((resolve, reject) => {
    const server = http.createServer(
      {
        IncomingMessage,
        ServerResponse
      }, requestListener
    );

    server.listen(options);

    server.on("listening", () => {
      const addr = server.address();
      logger.info(`Server started listening to incoming connections at ${addr.address}:${addr.port}`);
      resolve(server);
    });

    server.on("error", (error) => {
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

module.exports = createServer;
