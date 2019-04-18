"use strict";

const blueMax = require("../index");

blueMax()
  .then()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });