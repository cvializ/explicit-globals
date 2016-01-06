function identifierNode(identifierNode, globalName) {
  return {
    "type": "MemberExpression",
    "object": {
      "type": "Identifier",
      "name": globalName
    },
    "property": identifierNode,
  };
}

function replace(replaceFn, ast, test, globalName) {
  globalName = globalName || 'window';
  var replacement = {
    'Identifier': {
      replace: function(node) {
        return identifierNode(node, globalName);
      },
      test: test
    }
  };
  replaceFn(ast, replacement);
}

module.exports = replace;
