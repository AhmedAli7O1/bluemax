"use strict";


// https://www.npmjs.com/package/pretty-error

function exec (e) {

  const stack = [];

  e.stack.split("\n").forEach(x => {

    if (!x.match("internal/modules")) {
      stack.push(x);
    }

  });

  // console.log(stack.join("\n"));
  console.log(e);

  process.exit(0);
}

module.exports = exec;