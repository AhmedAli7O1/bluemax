"use strict";

/*
 * 1 - Http Server
 * 2 - Security Handler
 * 3 - Request Handler
 * 4 - Router
 * 5 - Routes
 * 6 - Authentication
 * 7 - Controllers
 * 8 - Components
 * 9 - Models
 */


const path = require("path");
const router = require("./router");
const routes = require("./lib/routes");
const controllers = require("./lib/controllers");
const config = require("./lib/config");
const logger = require("./lib/logger");
const serverCreator = require("./lib/server");

const appPath = process.cwd();
const routesPath = path.join(appPath, "routes");
const configPath = path.join(appPath, "config");
const controllersPath = path.join(appPath, "controllers");

async function start() {
  const userConfig = await config(configPath, "development");
  logger.debug("userConfig", userConfig);

  const controllersList = await controllers.load(controllersPath);
  logger.debug("controllersList", controllersList);

  const routesList = await routes.load(routesPath);
  logger.debug("routesList", routesList);

  routes.assignHandlers(routesList, controllersList);
  logger.debug("routesList after assign", routesList);

  router.register(routesList);

  return await serverCreator(router.requestListener, userConfig.server);
}

module.exports = start;

