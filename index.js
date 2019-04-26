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


const fs = require("./lib/fs");
const path = require("path");
const router = require("./lib/router");
const routes = require("./lib/routes");
const controllers = require("./lib/controllers");
const config = require("./lib/config");
const logger = require("./lib/logger");
const serverCreator = require("./lib/server");
const convention = require("./lib/convention");
const requestListener = require("./lib/listener");

const appPath = process.cwd();

const paths = {
  appPath: appPath,
  routesPath: path.join(appPath, "routes"),
  configPath: path.join(appPath, "config"),
  controllersPath: path.join(appPath, "controllers")
};

async function start() {
  try {
    logger.info(`Scanning APP Directory - ${paths.appPath}`);
    const appDirInfo = await fs.getDeepDirContent(paths.appPath);
    fs.setRelativePath(appDirInfo, paths.appPath);

    convention.scan(appDirInfo, paths);

    const userConfig = await config(paths.configPath, "development");
    // logger.debug("userConfig", userConfig);

    const controllersList = await controllers.load(paths.controllersPath);
    // logger.debug("controllersList", controllersList);

    const routeGroups = await routes.load(paths.routesPath);
    // logger.debug("routeGroups", routeGroups);

    routes.assignHandlers(routeGroups, controllersList);
    // logger.debug("routeGroups after assign", routeGroups);

    router.register(routeGroups);

    return await serverCreator(requestListener, userConfig.server);
  }
  catch (e) {
    logger.error(e.message);
    throw e;
  }

}

module.exports = start;

