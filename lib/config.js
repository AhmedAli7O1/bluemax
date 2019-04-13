"use strict";

const fs = require("./fs");
const utils = require("./utils");

/*
 * 1. get config directory content
 * 2. pick only files and one folder with equivalent name as the NODE_ENV
 * 3. build one configuration object from all the configuration files
 * 4. override the configuration object with the objects from the environment directory
 *
 * EX:
 * the file: config/foo.js                exports:  { one: 1, two: 2 }
 * the file: config/development/foo.js    exports:  { two: 20 }
 * the Result:
 *    while
 *      NODE_ENV !== "development" >> config.foo will be equal to { one: 1, two: 2 }
 *    while
 *      NODE_ENV === "development" >> config.foo will be equal to { one: 1, two: 20 }
 */

async function load (configPath, env) {
  const dirContent = await fs.getDirContent(configPath);

  const configFiles = [];
  let envConfigFiles = [], envConfigDir;

  dirContent.forEach(item => {
    if (item.type === "file") {
      configFiles.push(item);
    }
    else if (item.type === "dir" && item.name === env) {
      envConfigDir = item;
    }
  });

  if (envConfigDir) {
    envConfigFiles = await fs.getDirContent(envConfigDir.path, ["file"]);
  }

  // build main configurations object
  const commonConfig = await fs.loadFiles(configFiles);

  const envConfig = await fs.loadFiles(envConfigFiles);

  return utils.merge(commonConfig, envConfig);
}

module.exports = load;