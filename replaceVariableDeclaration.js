function assignmentNode(declarationNode, globalName) {
  var identifier = declarationNode.id;
  var valueNode = declarationNode.init;

  return {
    "type": "AssignmentExpression",
    "operator": "=",
    "left": {
      "type": "MemberExpression",
      "object": {
        "type": "Identifier",
        "name": "window"
      },
      "property": {
        "type": "Identifier",
        "name": identifier.name
      },
      "computed": false
    },
    "right": valueNode
  };
}

function assignmentsNode(declarationsNodes, globalName) {
  return {
    "type": "ExpressionStatement",
    "expression": {
      "type": "SequenceExpression",
      "expressions": declarationsNodes.map(assignmentNode, globalName)
    }
  };
}

function replace(replaceFn, ast, test, globalName) {
  globalName = globalName || 'window';
  var replacement = {
    'VariableDeclaration': {
      replace: function (node) {
        var declarations = node.declarations;
        if (declarations.length === 1) {
          return {
            "type": "ExpressionStatement",
            "expression": assignmentNode(declarations[0], globalName)
          };
        } else {
          return assignmentsNode(declarations, globalName);
        }
      },
      test: test
    }
  };

  replaceFn(ast, replacement);
}

module.exports = replace;
