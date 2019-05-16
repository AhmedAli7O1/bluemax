"use strict";


const fs = require("./lib/fs");
const path = require("path");
const routes = require("./lib/routes");
const controllers = require("./lib/controllers");
const config = require("./lib/config");
const logger = require("./lib/logger");
const Server = require("./lib/server");
const convention = require("./lib/convention");
const { setEnv } = require("./lib/env");
const internalConfig = require("./config.json");
const Router = require("./lib/router");
const Listener = require("./lib/listener");
const IncomingMessage = require("./lib/request");
const ServerResponse = require("./lib/response");

const appPath = process.cwd();

const paths = {
  appPath: appPath,
  routesPath: path.join(appPath, "routes"),
  configPath: path.join(appPath, "config"),
  controllersPath: path.join(appPath, "controllers")
};

async function start() {
  try {
    logger.info(`Starting BlueMaxJS Server Instance`);

    logger.info(`Scanning APP Directory - ${paths.appPath}`);
    const appDirInfo = await fs.getDeepDirContent(paths.appPath);

    fs.setRelativePath(appDirInfo, paths.appPath);

    logger.info(`Conventions check`);
    convention.scan(appDirInfo, paths);

    // TODO: replace the first arg with the app args
    const nodeEnv = setEnv({}, internalConfig.defaults);

    logger.info(`Loading environment configurations from ${paths.configPath}`);
    const appConfig = await config(paths.configPath, nodeEnv);

    logger.info(`Loading controllers from ${paths.controllersPath}`);
    const controllersList = await controllers.load(paths.controllersPath);

    logger.info(`Loading routes from ${paths.routesPath}`);
    const routeGroups = await routes.load(paths.routesPath);

    routes.assignHandlers(routeGroups, controllersList);

    const router = new Router();

    Array.from(...Object.values(routeGroups)).forEach(x => {
      router.register(x.method, x.path, x.handler);
    });


    const routerMatch = router.match.bind(router);

    const listener = new Listener(routerMatch);

    const requestListener = listener.requestListener.bind(listener);

    const server = new Server(
      {
        IncomingMessage,
        ServerResponse
      },
      requestListener
    );

    await server.start(appConfig.server);

    return server;
  }
  catch (e) {
    logger.error(e.message);
    throw e;
  }

}

module.exports = {
  logger,
  start
};

