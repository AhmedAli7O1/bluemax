"use strict";


const fs = require("./fs");
const utils = require("./utils");


async function load (routesPath) {
  const dirContent = await fs.getDirContent(routesPath, ["file"]);
  return fs.loadFiles(dirContent);
}

function assignHandlers (routeGroups, controllersList) {
  for (const routeGroupName in routeGroups) {
    if (routeGroups.hasOwnProperty(routeGroupName)) {
      routeGroups[routeGroupName].forEach(routeInfo => {
        if (typeof routeInfo.handler === "string") {
          const controllerName = utils.capitalize(routeGroupName) + "Controller";
          const handlerPath = controllerName + "." + routeInfo.handler;
          routeInfo.handler = utils.get(controllersList, handlerPath);
        }
      });
    }
  }
}

module.exports = {
  load,
  assignHandlers
};