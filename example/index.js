var fs = require('fs')
var explicitlyReferenceGlobals = require('../')

var codeIn = fs.readFileSync('./example/input.js','utf-8')
var codeOut = explicitlyReferenceGlobals(codeIn);

console.log(codeOut);
