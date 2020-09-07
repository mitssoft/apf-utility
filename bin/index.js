#!/usr/bin/env node

// import { apfu } from '../lib/apf-utility.js';
const minimist = require('minimist');
const apfu = require('../lib/apf-utility.js');

console.log(process.argv);

var arguments = process.argv.splice(2);

// let args = arguments[arguments.length - 1];

let command = arguments[0];
let subset = undefined;
if(arguments[1]) {
    subset = parseArray(arguments[1]);
}

if (command == 'import_apf') {
    console.log("Importing language>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    apfu.import_apf(arguments[1]);
} else {
    apfu.run(command, subset);
}

function parseArray(s) {
    var a = s.split(',');
    for(let i = 0; i < a.length; i++) {a[i] = parseInt(a[i])}
    return a;
}