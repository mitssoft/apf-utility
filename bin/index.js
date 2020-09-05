#!/usr/bin/env node

// import { apfu } from '../lib/apf-utility.js';
const apfu = require('../lib/apf-utility.js');

console.log(process.argv);

var arguments = process.argv.splice(2);

let arg = arguments[arguments.length - 1];

let command = arguments[0];

if (command == 'import') {
    console.log("Importing language>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    apfu.import(arguments[1]);
} else {
    apfu.run(arg);
}

