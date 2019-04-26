"use strict";


function getAllHello (req, res) {
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
