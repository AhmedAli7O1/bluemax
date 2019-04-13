'use strict';

const fs = require("fs");
const util = require("util");
const path = require("path");
const config = require("../config.json");
const { mapAsync } = require("./promise");


const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);
const lstat = util.promisify(fs.lstat);
const rmdir = util.promisify(fs.rmdir);
const mkdtemp = util.promisify(fs.mkdtemp);
const mkdir = util.promisify(fs.mkdir);
const writeFile = util.promisify(fs.writeFile);
const unlink = util.promisify(fs.unlink);


async function removeDir(dir) {
  const content = await readdir(dir);

  await Promise.all(content.map(async item => {
    const fullPath = path.join(dir, item);
    const stat = await lstat(fullPath);

    if (stat.isDirectory()) {
      await removeDir(fullPath);
    } else {
      await fs.unlink(fullPath);
    }
  }));

  await fs.rmdir(dir);
}

async function getDirContent(dirPath, filter = ["file", "dir"]) {
  let dirContent = await readdir(dirPath);

  dirContent = await mapAsync(dirContent, async (item) => {
    const itemPath = path.join(dirPath, item);

    let itemInfo = path.parse(itemPath);
    itemInfo.path = itemPath;

    const stat = await lstat(itemPath);
    if (stat.isDirectory()) {
      itemInfo.type = "dir";
    } else if (stat.isFile() && config.supportedFileTypes.includes(itemInfo.ext)) {
      itemInfo.type = "file";
    } else {
      itemInfo = null;
    }

    return itemInfo;
  });

  return dirContent.filter((item) => {
    return item && filter.includes(item.type);
  });
}

function loadFiles (filesList) {
  const loaded = {};

  filesList.forEach(file => {
    loaded[file.name] = require(file.path);
  });

  return loaded;
}

module.exports = {
  readdir,
  readFile,
  lstat,
  rmdir,
  mkdtemp,
  mkdir,
  writeFile,
  unlink,
  removeDir,
  getDirContent,
  loadFiles
};
