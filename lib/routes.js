"use strict";


const fs = require("./fs");
const utils = require("./utils");


async function load (routesPath) {
  let routes = [];

  const dirContent = await fs.getDirContent(routesPath, ["file"]);

  const loaded = fs.loadFiles(dirContent);

  for (const key in loaded) {
    routes = routes.concat(loaded[key]);
  }

  return routes;
}

function assignHandlers (routesList, controllersList) {
  routesList.forEach(route => {
    if (typeof route.handler === "string") {
      route.handler = utils.get(controllersList, route.handler);
    }
  });
}

module.exports = {
  load,
  assignHandlers
};