"use strict";

class RouterNode {
  constructor(key) {
    this.key = key;
    this.parent = null;
    this.children = {};
    this.end = false;
    this.namedParam = null;
    this.methods = {};
  }
}


class Router {
  constructor() {
    this.root = new RouterNode(null);
    this.pathRgx = new RegExp(/{([a-zA-Z_]+)}/);
  }

  register(method, path, handler) {
    let node = this.root;

    const pathParts = path.split("/");

    for(let i = 0; i < pathParts.length; i++) {

      // it's either a path part or a named param
      const rgxResult = this.pathRgx.exec(pathParts[i]);

      if (rgxResult) {
        node.namedParam = rgxResult[1];
      }
      else {
        for (let y = 0; y < pathParts[i].length; y++) {
          // create the node if it doesn't exist
          if(!node.children[pathParts[i][y]]) {
            node.children[pathParts[i][y]] = new RouterNode(pathParts[i][y]);
            node.children[pathParts[i][y]].parent = node;
          }

          // put the pointer on this node
          node = node.children[pathParts[i][y]];
        }
      }

      if (i === pathParts.length - 1) {
        node.methods[method] = handler;
        node.end = true;
      }
    }
  }

  match(method, path) {
    let node = this.root;

    const pathParts = path.split("/");
    const params = {};

    for(let i = 0; i < pathParts.length; i++) {
      if (node.namedParam && !params[node.namedParam]) {
        params[node.namedParam] = pathParts[i];
      }
      else {
        for (let y = 0; y < pathParts[i].length; y++) {
          if (node.children[pathParts[i][y]]) {
            node = node.children[pathParts[i][y]];
          }
          else {
            return false;
          }
        }
      }
    }


    if (node && node.methods && node.methods[method]) {
      const handler = node.methods[method];

      return {
        handler,
        params
      };

    }
    else return null;
  }
}

// router.register("GET", "hello/{id}/lol/ii/{name}", "handlerOne");
// const matched = router.match("GET", "hello/123/lol/ii/mohamed");

module.exports = Router;