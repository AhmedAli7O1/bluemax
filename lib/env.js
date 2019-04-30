"use strict";

const logger = require("./logger");


function setEnv (appArgs, defaults) {
  if (appArgs.env) {
    logger.info(`Setting environment to ${appArgs.env} according to the provided arguments`);
    process.env.NODE_ENV = appArgs.env;
  }
  else if (process.env.NODE_ENV) {
    logger.info(`Setting environment to ${process.env.NODE_ENV} according to the NODE_ENV`);
  }
  else {
    logger.warn(`cannot find the environment settings, falling back to the default :: ${defaults.env}`);
    process.env.NODE_ENV = defaults.env;
  }

  return process.env.NODE_ENV;
}

module.exports = { setEnv };