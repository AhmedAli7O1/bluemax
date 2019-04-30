"use strict";


const config = require("../config.json");
const logger = require("./logger");

function setEnv (userConfig, appArgs) {
  if (userConfig.env) {
    logger.info(`Setting environment to ${userConfig.env} according to the app config`);
    return;
  }

  if (appArgs.env) {
    logger.info(`Setting environment to ${appArgs.env} according to the provided arguments`);
    return;
  }

  if (process.env.NODE_ENV) {
    logger.info(`Setting environment to ${process.env.NODE_ENV} according to the NODE_ENV`);
    return;
  }

  logger.warn(`cannot find environment settings, falling back to the default :: ${config.defaults.env}`);
  return config.defaults.env;
}

module.exports = { setEnv };