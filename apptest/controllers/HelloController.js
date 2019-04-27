"use strict";

const Test = require("../components/Test");

// error on load
// console.log(lol.koko);

function getAllHello (req, res) {

  // runtime error
  console.log(req.lol.pp);

  res
    .status(200)
    .json({ fn: "getAllHello" });
}

function getHelloByName (req, res) {
  res
    .header("header-one", "1")
    .header("header-two", "2")
    .json({ fn: "getHelloByName", params: req.params });
}

function getHelloById (req, res) {
  res.json({ fn: "getHelloById", params: req.params });
}

function getHelloCommentById (req, res) {
  res.json({ fn: "getHelloCommentById", params: req.params });
}


module.exports = {
  getAllHello,
  getHelloByName,
  getHelloById,
  getHelloCommentById
};
