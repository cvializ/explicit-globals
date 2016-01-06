function subMemberNode(memberNode, globalName) {
  var oldIdentifier = memberNode.object;
  var oldProperty = memberNode.property;

  return {
    "type": "MemberExpression",
    "object": {
      "type": "MemberExpression",
      "object": {
        "type": "Identifier",
        "name": globalName
      },
      "property": oldIdentifier,
    },
    "property": oldProperty,
    "computed": memberNode.computed
  };
}

function replace(replaceFn, ast, test, globalName) {
  globalName = globalName || 'window';
  var replacement = {
    'MemberExpression': {
      replace: function (node) {
        return subMemberNode(node, globalName);
      },
      test: test
    }
  };
  replaceFn(ast, replacement);
}

module.exports = replace;
