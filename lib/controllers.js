"use strict";


const fs = require("./fs");

async function load (controllersPath) {
  const dirContent = await fs.getDirContent(controllersPath, ["file"]);
  return fs.loadFiles(dirContent);
}

module.exports = {
  load
};