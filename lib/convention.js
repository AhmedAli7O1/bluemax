"use strict";


const logger = require("./logger");


const conventions = [
  {
    path: new RegExp(/\/routes\/.*?js/),
    rules: [
      {
        name: "naming",
        rgx: new RegExp(/^([a-z][A-Za-z]+)$/),
        messages: [
          "file name can only contains english letters caps and small",
          "the first letter should be always small",
        ]
      }
    ]
  },
  {
    path: new RegExp(/\/controllers\/.*?js/),
    rules: [
      {
        name: "naming",
        rgx: new RegExp(/^([A-Z][A-Za-z]+)$/),
        messages: [
          "file name can only contains english letters caps and small",
          "the first letter should be always capital"
        ]
      }
    ]
  }
];

function buildMsg (pathInfo, messages) {
  return `Path: ${pathInfo.relativePath} - Rules: ${messages.join(" , ")}`;
}

const validation = {

  naming (pathInfo, rgx, messages) {
    return rgx.test(pathInfo.name) ? null : buildMsg(pathInfo, messages);
  }

};

function scan (appDirInfo, paths) {

  const errors = [];

  appDirInfo.forEach(pathInfo => {

    // available rules for current path
    conventions.forEach(ruleSet => {
      if (ruleSet.path.test(pathInfo.relativePath)) {

        ruleSet.rules.forEach(rule => {

          const validationRule = validation[rule.name];

          const msg = validationRule(pathInfo, rule.rgx, rule.messages);

          if (msg) errors.push(msg);

        });
      }
    });
  });

  errors.forEach(x => {
    const msgParts = x.split(" - ");
    let path = msgParts[0].split(": ")[1];
    let issues = msgParts[1].split(": ")[1].split(" , ");

    let userMsg = "";

    userMsg += logger.colors.reset + logger.colors.fgCyan + "\n\tPath:\t";
    userMsg += logger.colors.fgGreen + path + "\n\t";
    userMsg += logger.colors.fgCyan + "Rules:";
    userMsg += logger.colors.fgRed;

    issues.forEach(x => userMsg += "\n\t  - " + x);

    userMsg += logger.colors.reset + "\n";

    console.log(userMsg);
  });

  if (errors.length) {
    throw new Error(`${errors.length} convention violation found, please fix the reported issues before starting the server again!`);
  }
}

module.exports = {
  scan
};

