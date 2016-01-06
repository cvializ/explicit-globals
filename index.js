var escodegen = require('escodegen');
var rocambole = require('rocambole');
var detectGlobals = require('acorn-globals');
var astReplace = require('ast-replace');

var replaceDeclarations = require('./replaceVariableDeclaration').bind(null, astReplace);
var replaceFunctionDeclaration = require('./replaceFunctionDeclaration').bind(null, astReplace);
var replaceExpression = require('./replaceExpression').bind(null, astReplace);
var replaceIdentifier = require('./replaceIdentifier').bind(null, astReplace);

function explicitlyReferenceGlobals(src) {
  var ast = rocambole.parse(src);
  var globals = detectGlobals(ast, { includeFileVars: true, includeFunctionDeclarations: true });

  globals.reduce(function (acc, g) { return acc.concat(g.nodes); }, []).forEach(function (g) {
    var lastItemIndex = g.parents.length - 1;
    var grandparent = g.parents[lastItemIndex - 2];
    var parent = g.parents[lastItemIndex - 1];

    function testAncestor(ancestor, node) {
      return (node === ancestor);
    }

    if (parent && parent.type === 'VariableDeclarator' && grandparent && grandparent.type === 'VariableDeclaration') {
      replaceDeclarations(grandparent.parent, testAncestor.bind(null, grandparent));
    } else if (parent && parent.type === 'FunctionDeclaration' && parent.id === g) {
      replaceFunctionDeclaration(parent.parent, testAncestor.bind(null, parent));
    } else if (parent && parent.type === 'MemberExpression') {
      replaceExpression(parent.parent, testAncestor.bind(null, parent));
    } else if (g.type === 'Identifier') {
      replaceIdentifier(g.parent, testAncestor.bind(null, g));
    }
  });

  return escodegen.generate(ast);
}

module.exports = explicitlyReferenceGlobals;
