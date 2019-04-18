"use strict";


function getAllHello (req, res) {
  const msg = `Hello there\nthis is the BlueMax Node.js Webserver\nFunction: getAllHello`;

  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end(msg);
}

function getHelloByName (req, res) {
  const helloName = req.params.helloName;
  const msg = `Hello, ${helloName}!\nthis is the BlueMax Node.js Webserver\n`;

  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end(msg);
}

function getHelloById (req, res) {
  const helloId = req.params.helloId;

  const msg = `Hello there\nthis is the BlueMax Node.js Webserver\nFunction: getHelloById\nhelloId: ${helloId}`;

  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end(msg);
}

function getHelloCommentById (req, res) {
  const helloId = req.params.helloId;
  const commentId = req.params.commentId;

  const msg = `Hello there\nthis is the BlueMax Node.js Webserver\nFunction: getAllHello\nhelloId: ${helloId} - commentId: ${commentId}`;

  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end(msg);
}


module.exports = {
  getAllHello,
  getHelloByName,
  getHelloById,
  getHelloCommentById
};
