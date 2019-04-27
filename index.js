"use strict";


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

const nodeEnv = process.env.NODE_ENV || "development";

async function start() {
  try {
    logger.info(`Starting BlueMaxJS Server Instance`);

    logger.info(`Setting environment to ${nodeEnv}`);

    logger.info(`Scanning APP Directory - ${paths.appPath}`);
    const appDirInfo = await fs.getDeepDirContent(paths.appPath);

    fs.setRelativePath(appDirInfo, paths.appPath);

    logger.info(`Conventions check`);
    convention.scan(appDirInfo, paths);

    logger.info(`Loading environment configurations from ${paths.configPath}`);
    const userConfig = await config(paths.configPath, "development");

    logger.info(`Loading controllers from ${paths.controllersPath}`);
    const controllersList = await controllers.load(paths.controllersPath);

    logger.info(`Loading routes from ${paths.routesPath}`);
    const routeGroups = await routes.load(paths.routesPath);

    routes.assignHandlers(routeGroups, controllersList);

    router.register(routeGroups);

    return await serverCreator(requestListener, userConfig.server);
  }
  catch (e) {
    logger.error(e.message);
    throw e;
  }

}

module.exports = start;

