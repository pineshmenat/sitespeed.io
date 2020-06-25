'use strict';

const sitespeed = require('./lib/sitespeed');
const fs = require('fs');
const urls = ["https://www.sitespeed.io/"];
const defaultconfig = JSON.parse(fs.readFileSync("./defaultconfig.json", {
  encoding: "utf-8"
}));

async function run() {
  try {
    const result = await sitespeed.run({
      ...defaultconfig,
      urls: urls,
      "mobile": false,
      "explicitOptions": {
        "sustainable": {
          "enable": true
        },
        "n": 2,
        "$0": "bin\\sitespeed.js",
        "plugins": {
          "add": ["plugin-lighthouse", "plugin-gpsi"]
        },
        "gpsi": {
          "key": "AIzaSyBxnezgZyEmXcoAqTfvWnY1kb2evjk6-hs"
        },
        "siteType": 0,
        "lighthouse": {
          "iterations": 1,
          "extends": "lighthouse:default"
        },
        "html": {
          "assetsBaseURL": "http://localhost:5000/"
        },
        "mysqldb": {
          "host": "localhost",
          "port": "8086",
          "user": "root",
          "password": "35333",
          "database": "lighthouse",
          "table": "sitetypes",
          "includeQueryParams": "true"
        },
        "metrics": {
          "filter": ["*-", "gpsi.pageSummary.*", "gpsi.summary.*"],
          "list": true,
          "filterList": true
        }
      }
    });
    console.log(result);
  } catch (e) {
    console.error(e);
  }
}

run();