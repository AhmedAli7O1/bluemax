"use strict";


class RouterNode {
  constructor(key) {
    this.key = key;
    this.parent = null;
    this.children = {};
    this.end = false;
    this.handlers = [];
  }
}

class Router {
  constructor() {
    this.root = new RouterNode(null);
    this.pathRgx = new RegExp(/{([a-zA-Z_]+)}/);
  }

  register(method, path, handler) {
    let node = this.root;

    const params = [];

    const pathParts = path.split("/");

    for(let i = 0; i < pathParts.length; i++) {

      // it's either a path part or a named param
      const rgxResult = this.pathRgx.exec(pathParts[i]);

      if (rgxResult) {
        params.push({
          pos: i,
          param: rgxResult[1]
        });
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
        node.handlers.push({
          handler,
          method,
          params
        });
        node.end = true;
      }
    }
  }

  match(method, path) {
    let node = this.root;

    const pathParts = path.split("/");
    const params = [];

    for(let i = 0; i < pathParts.length; i++) {

      let partNode = node;

      for (let y = 0; y < pathParts[i].length; y++) {
        if (partNode.children[pathParts[i][y]]) {
          partNode = partNode.children[pathParts[i][y]];
        }
        else {
          params.push({
            pos: i,
            value: pathParts[i]
          });
          partNode = null;
          break;
        }
      }

      node = partNode ? partNode : node;
    }

    if (!node || !node.handlers.length) return null;


    const foundHandler = node.handlers.find(handler => {
      return handler.method === method &&
        handler.params.length === params.length &&
        handler.params.every((x) => params.find(y => y.pos === x.pos));
    });

    if (!foundHandler) return null;

    // resolve params
    const resolvedParams = {};

    for (let i = 0; i < foundHandler.params.length; i++) {
      resolvedParams[foundHandler.params[i].param] = params[i].value;
    }

    return {
      handler: foundHandler.handler,
      params: resolvedParams
    };
  }
}


module.exports = Router;
