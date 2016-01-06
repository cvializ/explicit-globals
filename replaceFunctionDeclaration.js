function functionExpressionNode(functionDeclarationNode, globalName) {
  return {
    "type": "ExpressionStatement",
    "expression": {
      "type": "AssignmentExpression",
      "operator": "=",
      "left": {
        "type": "MemberExpression",
        "object": {
          "type": "Identifier",
          "name": globalName
        },
        "property": functionDeclarationNode.id,
        "computed": false
      },
      "right": {
        "type": "FunctionExpression",
        "id": null,
        "params": functionDeclarationNode.params,
        "body": functionDeclarationNode.body,
        "expression": false
      }
    }
  };
}

function replace(replaceFn, ast, test, globalName) {
  globalName = globalName || 'window';
  var replacement = {
    'FunctionDeclaration': {
      replace: function (node) {
        return functionExpressionNode(node, globalName);
      },
      test: test
    }
  };
  replaceFn(ast, replacement);
}

module.exports = replace;
