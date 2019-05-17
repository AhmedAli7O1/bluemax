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
const utils = require("./lib/utils");

const appPath = process.cwd();

const paths = {
  appPath: appPath,
  routesPath: path.join(appPath, "routes"),
  configPath: path.join(appPath, "config"),
  controllersPath: path.join(appPath, "controllers"),
  componentsPath: path.join(appPath, "components")
};


class BlueMax {
  constructor() {
    this.fs = fs;
    this.utils = utils;
    this.logger = logger;
    this.env = null;
    this.server = null;
    this.paths = paths;
    this.appDirInfo = null;
  }

  async start() {
    try {
      logger.info(`Starting BlueMaxJS Server Instance`);

      logger.info(`Scanning APP Directory - ${paths.appPath}`);
      this.appDirInfo = await fs.getDeepDirContent(paths.appPath);

      fs.setRelativePath(this.appDirInfo, paths.appPath);

      logger.info(`Conventions check`);
      convention.scan(this.appDirInfo, paths);

      // TODO: replace the first arg with the app args
      this.env = setEnv({}, internalConfig.defaults);

      logger.info(`Loading environment configurations from ${paths.configPath}`);
      this.config = await config(paths.configPath, this.env);

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

      this.server = new Server(
        {
          IncomingMessage,
          ServerResponse
        },
        requestListener
      );

      await this.server.start(this.config.server);

      return this.server;
    }
    catch (e) {
      logger.error(e.message);
      throw e;
    }
  }

  use(requestedPath) {

    let resolved;

    const parts = requestedPath.split("/");

    resolved = this.utils.get(this, parts.join("."));

    if (!resolved) {
      // TODO: refactor the whole function, contains hardcoded stuff
      const fileInfo = this.appDirInfo.find(x => x.relativePath === "/" + requestedPath + ".js");

      if (fileInfo) {
        resolved = require(fileInfo.path);
      }
    }

    return resolved;
  }
}

module.exports = BlueMax;
