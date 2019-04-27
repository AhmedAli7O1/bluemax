"use strict";

const blueMax = require("../index");

blueMax()
  .then()
  .catch((e) => {
    console.log("app", e);
    process.exit(1);
  });