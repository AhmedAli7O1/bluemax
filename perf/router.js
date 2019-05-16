"use strict";

// path parts: generate random number between 1 - 10
// for each part: generate random word 5 - 15 char


const Router = require("../lib/router");
const routerRgx = require("../lib/router-rgx");


const router = new Router();


const characters = "abcdefghijklmnopqrstuvwxyz";
const methods = ["GET", "POST", "PUT", "DELETE", "PATCH"];


function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
}


function getRandomWord(min, max) {
  const wordLength = getRandomInt(min, max);
  let word = "";

  for (let i = 0; i < wordLength; i++) {
    const randChar = characters[getRandomInt(0, characters.length - 1)];
    word += randChar;
  }

  return word;
}

function getRandomPath() {
  const pathPartsSize = getRandomInt(1, 10);
  let colPath = "", curlPath = "", samplePath = "";


  for (let i = 0; i < pathPartsSize; i++) {
    const paramRand = getRandomInt(0, pathPartsSize - 1);
    const randWord = getRandomWord(5, 15);


    if (paramRand === i) {
      curlPath += "/{" + randWord + "}";
      colPath += "/:" + randWord;
      samplePath += "/" + getRandomWord(5, 10);
    } else {
      curlPath += "/" + randWord;
      colPath += "/" + randWord;
      samplePath += "/" + randWord;
    }
  }

  return {curlPath, colPath, samplePath};
}

function getRandomRoute() {
  const randMethod = methods[getRandomInt(0, methods.length - 1)];
  const {curlPath, colPath, samplePath} = getRandomPath();
  const randHandler = getRandomWord(5, 15);

  return {
    method: randMethod,
    curlPath,
    colPath,
    samplePath,
    handler: randHandler
  };
}

function measure(fn) {
  const start = new Date();
  const hrStart = process.hrtime();

  fn();

  const end = new Date() - start;
  const hrEnd = process.hrtime(hrStart);

  return `Execution time: ${end}ms\nExecution time (hr): ${hrEnd[0]}s ${hrEnd[1] / 1000000}ms`;
}

function generateTestCases(size) {
  const testCases = [];

  console.log("--------- Generating Test Cases ---------");

  console.log(`Generating ${size} Test Cases`);

  for (let i = 0; i < size; i++) {
    const { method, curlPath, colPath, samplePath, handler } = getRandomRoute();

    testCases.push({
      method,
      path: samplePath,
      handler,
      curlPath,
      colPath
    });
  }

  return testCases;
}

function runTests(testCases) {
  console.log("---------- Registering Routes ----------");

  console.log(`Regex Router: Registering ${testCases.length} Routes`);
  console.log(
    measure(() => {
      for (let i = 0; i < testCases.length; i++) {
        routerRgx.register(testCases[i].method, testCases[i].colPath, testCases[i].handler);
      }
    })
  );

  console.log("\n");

  console.log(`Trie Router: Registering ${testCases.length} Routes`);
  console.log(
    measure(() => {
      for (let i = 0; i < testCases.length; i++) {
        router.register(testCases[i].method, testCases[i].curlPath, testCases[i].handler);
      }
    })
  );


  console.log("------------ Matching Routes -----------");

  console.log(`Regex Router: running ${testCases.length} test cases`);

  console.log(
    measure(() => {
      let counter = 0;

      for (let i = 0; i < testCases.length; i++) {
        const matched = routerRgx.match(testCases[i].method, testCases[i].path);
        if (matched && matched.handler === testCases[i].handler) {
          counter++;
        } else {
          // console.log(testCases[i]);
          // console.log(matched);
        }
      }

      console.log(`matching count: ${counter}`);
    })
  );

  console.log("\n");

  console.log(`Trie Router: running ${testCases.length} test cases`);

  console.log(
    measure(() => {
      let counter = 0;

      for (let i = 0; i < testCases.length; i++) {
        const matched = router.match(testCases[i].method, testCases[i].path);
        if (matched && matched.handler === testCases[i].handler) {
          counter++;
        } else {
          // console.log(testCases[i]);
          // console.log(matched);
        }
      }

      console.log(`matching count: ${counter}`);
    })
  );

  console.log("----------------------------------------");
}

runTests(generateTestCases(1000));