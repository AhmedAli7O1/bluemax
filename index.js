"use strict";


const BlueMax = require("./bluemax");

const blueMaxProxy = new Proxy(new BlueMax(), {
  get(target, p) {
    if (typeof target[p] === "function") {
      target[p] = target[p].bind(target);
    }

    return target[p];
  }
});

module.exports = blueMaxProxy;