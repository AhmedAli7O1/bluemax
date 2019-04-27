"use strict";


const fs = require("./fs");

async function load (controllersPath) {
  let controllers = {};
  const dirContent = await fs.getDirContent(controllersPath, ["file"]);

  dirContent.forEach(fileInfo => {
    try {
      controllers[fileInfo.name] = fs.loadFile(fileInfo.path);
    }
    catch (e) {
      throw e;
    }
  });

  return controllers;
}

module.exports = {
  load
};