"use strict";


const http = require("http");
const logger = require("./logger");


async function createServer (requestListener, options) {
  return new Promise((resolve, reject) => {
    const server = http.createServer(requestListener);

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
        const port = 3000; // TODO: change this to be dynamically fetched from server.address()

        switch (error.code) {
          case "EACCES":
            logger.error(`port ${port} requires elevated privileges`);
            break;
          case "EADDRINUSE":
            logger.error(`port ${port} is already in use`);
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
