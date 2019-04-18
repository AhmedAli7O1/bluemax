"use strict";

module.exports = [
  {
    path: "/hello",
    method: "GET",
    handler: "getAllHello"
  },
  {
    path: "/hello/:helloName",
    method: "GET",
    handler: "getHelloByName"
  },
  {
    path: "/hello/:helloId/one",
    method: "GET",
    handler: "getHelloById"
  },
  {
    path: "/hello/:helloId/comment/:commentId",
    method: "GET",
    handler: "getHelloCommentById"
  }
];