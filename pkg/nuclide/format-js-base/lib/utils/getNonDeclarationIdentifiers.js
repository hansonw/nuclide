

var getNamesFromID = require('./getNamesFromID');

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

var jscs = require('jscodeshift');

var REACT_NODE = jscs.identifier('React');

/**
 * These are the ways in which one might access an undeclared identifier. This
 * should only apply to actual code, not accessing undeclared types.
 */
var CONFIG = [
// foo;
{
  searchTerms: [jscs.ExpressionStatement],
  getNodes: function getNodes(path) {
    return [path.node.expression];
  }
},

// foo(bar);
{
  searchTerms: [jscs.CallExpression],
  getNodes: function getNodes(path) {
    return [path.node.callee].concat(path.node.arguments);
  }
},

// foo.declared;
{
  searchTerms: [jscs.MemberExpression],
  getNodes: function getNodes(path) {
    return [path.node.object];
  }
},

// foo = bar;
{
  searchTerms: [jscs.AssignmentExpression],
  getNodes: function getNodes(path) {
    return [path.node.left, path.node.right];
  }
},

// class declared extends foo {}
{
  searchTerms: [jscs.ClassDeclaration],
  getNodes: function getNodes(path) {
    return [path.node.superClass];
  }
},

// var declared = foo;
{
  searchTerms: [jscs.VariableDeclarator],
  getNodes: function getNodes(path) {
    return [path.node.init];
  }
},

// switch (declared) { case foo: break; }
{
  searchTerms: [jscs.SwitchCase],
  getNodes: function getNodes(path) {
    return [path.node.test];
  }
},

// {declared: foo}
{
  searchTerms: [jscs.ObjectExpression],
  // Generally props have a value, if it is a spread property it doesn't.
  getNodes: function getNodes(path) {
    return path.node.properties.map(function (prop) {
      return prop.value || prop;
    });
  }
},

// return foo;
{
  searchTerms: [jscs.ReturnStatement],
  getNodes: function getNodes(path) {
    return [path.node.argument];
  }
},

// if (foo) {}
{
  searchTerms: [jscs.IfStatement],
  getNodes: function getNodes(path) {
    return [path.node.test];
  }
},

// switch (foo) {}
{
  searchTerms: [jscs.SwitchStatement],
  getNodes: function getNodes(path) {
    return [path.node.discriminant];
  }
},

// !foo;
{
  searchTerms: [jscs.UnaryExpression],
  getNodes: function getNodes(path) {
    return [path.node.argument];
  }
},

// foo || bar;
{
  searchTerms: [jscs.BinaryExpression],
  getNodes: function getNodes(path) {
    return [path.node.left, path.node.right];
  }
},

// foo < bar;
{
  searchTerms: [jscs.LogicalExpression],
  getNodes: function getNodes(path) {
    return [path.node.left, path.node.right];
  }
},

// foo ? bar : baz;
{
  searchTerms: [jscs.ConditionalExpression],
  getNodes: function getNodes(path) {
    return [path.node.test, path.node.alternate, path.node.consequent];
  }
},

// new Foo()
{
  searchTerms: [jscs.NewExpression],
  getNodes: function getNodes(path) {
    return [path.node.callee].concat(path.node.arguments);
  }
},

// foo++;
{
  searchTerms: [jscs.UpdateExpression],
  getNodes: function getNodes(path) {
    return [path.node.argument];
  }
},

// <Element attribute={foo} />
{
  searchTerms: [jscs.JSXExpressionContainer],
  getNodes: function getNodes(path) {
    return [path.node.expression];
  }
},

// for (foo in bar) {}
{
  searchTerms: [jscs.ForInStatement],
  getNodes: function getNodes(path) {
    return [path.node.left, path.node.right];
  }
},

// for (foo of bar) {}
{
  searchTerms: [jscs.ForOfStatement],
  getNodes: function getNodes(path) {
    return [path.node.left, path.node.right];
  }
},

// for (foo; bar; baz) {}
{
  searchTerms: [jscs.ForStatement],
  getNodes: function getNodes(path) {
    return [path.node.init, path.node.test, path.node.update];
  }
},

// while (foo) {}
{
  searchTerms: [jscs.WhileStatement],
  getNodes: function getNodes(path) {
    return [path.node.test];
  }
},

// do {} while (foo)
{
  searchTerms: [jscs.DoWhileStatement],
  getNodes: function getNodes(path) {
    return [path.node.test];
  }
},

// [foo]
{
  searchTerms: [jscs.ArrayExpression],
  getNodes: function getNodes(path) {
    return path.node.elements;
  }
},

// Special case. Any JSX elements will get transpiled to use React.
{
  searchTerms: [jscs.JSXOpeningElement],
  getNodes: function getNodes(path) {
    return [REACT_NODE];
  }
},

// foo`something`
{
  searchTerms: [jscs.TaggedTemplateExpression],
  getNodes: function getNodes(path) {
    return [path.node.tag];
  }
},

// `${bar}`
{
  searchTerms: [jscs.TemplateLiteral],
  getNodes: function getNodes(path) {
    return path.node.expressions;
  }
},

// function foo(a = b) {}
{
  searchTerms: [jscs.AssignmentPattern],
  getNodes: function getNodes(path) {
    return [path.node.right];
  }
}];

/**
 * This will get a list of all identifiers that are not from a declaration.
 *
 * NOTE: this can get identifiers that are declared, if you want access to
 * identifiers that are access but undeclared see getUndeclaredIdentifiers
 */
function getNonDeclarationIdentifiers(root) {
  var ids = new Set();
  CONFIG.forEach(function (config) {
    root.find(config.searchTerms[0], config.searchTerms[1]).forEach(function (path) {
      var nodes = config.getNodes(path);
      nodes.forEach(function (node) {
        var names = getNamesFromID(node);
        for (var _name of names) {
          ids.add(_name);
        }
      });
    });
  });
  return ids;
}

module.exports = getNonDeclarationIdentifiers;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImdldE5vbkRlY2xhcmF0aW9uSWRlbnRpZmllcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFhQSxJQUFNLGNBQWMsR0FBRyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQzs7Ozs7Ozs7OztBQUNuRCxJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7O0FBT3BDLElBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7Ozs7OztBQU01QyxJQUFNLE1BQTBCLEdBQUc7O0FBRWpDO0FBQ0UsYUFBVyxFQUFFLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDO0FBQ3ZDLFVBQVEsRUFBRSxrQkFBQSxJQUFJO1dBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztHQUFBO0NBQ3pDOzs7QUFHRDtBQUNFLGFBQVcsRUFBRSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUM7QUFDbEMsVUFBUSxFQUFFLGtCQUFBLElBQUk7V0FBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO0dBQUE7Q0FDakU7OztBQUdEO0FBQ0UsYUFBVyxFQUFFLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDO0FBQ3BDLFVBQVEsRUFBRSxrQkFBQSxJQUFJO1dBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztHQUFBO0NBQ3JDOzs7QUFHRDtBQUNFLGFBQVcsRUFBRSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQztBQUN4QyxVQUFRLEVBQUUsa0JBQUEsSUFBSTtXQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7R0FBQTtDQUNwRDs7O0FBR0Q7QUFDRSxhQUFXLEVBQUUsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUM7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QUssQ0FBQyxPQUFPLENBQUMsVUFBQSxJQUFJLEVBQUk7QUFDcEIsWUFBTSxLQUFLLEdBQUcsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ25DLGFBQUssSUFBTSxLQUFJLElBQUksS0FBSyxFQUFFO0FBQ3hCLGFBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSSxDQUFDLENBQUM7U0FDZjtPQUNGLENBQUMsQ0FBQztLQUNKLENBQUMsQ0FBQztHQUNOLENBQUMsQ0FBQztBQUNILFNBQU8sR0FBRyxDQUFDO0NBQ1o7O0FBRUQsTUFBTSxDQUFDLE9BQU8sR0FBRyw0QkFBNEIsQ0FBQyIsImZpbGUiOiJnZXROb25EZWNsYXJhdGlvbklkZW50aWZpZXJzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG4vKiBAZmxvdyAqL1xuXG4vKlxuICogQ29weXJpZ2h0IChjKSAyMDE1LXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIGxpY2Vuc2UgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBpblxuICogdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuaW1wb3J0IHR5cGUge0NvbGxlY3Rpb24sIE5vZGUsIE5vZGVQYXRofSBmcm9tICcuLi90eXBlcy9hc3QnO1xuXG5jb25zdCBnZXROYW1lc0Zyb21JRCA9IHJlcXVpcmUoJy4vZ2V0TmFtZXNGcm9tSUQnKTtcbmNvbnN0IGpzY3MgPSByZXF1aXJlKCdqc2NvZGVzaGlmdCcpO1xuXG50eXBlIENvbmZpZ0VudHJ5ID0ge1xuICBzZWFyY2hUZXJtczogW2FueSwgT2JqZWN0XTtcbiAgZ2V0Tm9kZXM6IChwYXRoOiBOb2RlUGF0aCkgPT4gQXJyYXk8Tm9kZT47XG59O1xuXG5jb25zdCBSRUFDVF9OT0RFID0ganNjcy5pZGVudGlmaWVyKCdSZWFjdCcpO1xuXG4vKipcbiAqIFRoZXNlIGFyZSB0aGUgd2F5cyBpbiB3aGljaCBvbmUgbWlnaHQgYWNjZXNzIGFuIHVuZGVjbGFyZWQgaWRlbnRpZmllci4gVGhpc1xuICogc2hvdWxkIG9ubHkgYXBwbHkgdG8gYWN0dWFsIGNvZGUsIG5vdCBhY2Nlc3NpbmcgdW5kZWNsYXJlZCB0eXBlcy5cbiAqL1xuY29uc3QgQ09ORklHOiBBcnJheTxDb25maWdFbnRyeT4gPSBbXG4gIC8vIGZvbztcbiAge1xuICAgIHNlYXJjaFRlcm1zOiBbanNjcy5FeHByZXNzaW9uU3RhdGVtZW50XSxcbiAgICBnZXROb2RlczogcGF0aCA9PiBbcGF0aC5ub2RlLmV4cHJlc3Npb25dLFxuICB9LFxuXG4gIC8vIGZvbyhiYXIpO1xuICB7XG4gICAgc2VhcmNoVGVybXM6IFtqc2NzLkNhbGxFeHByZXNzaW9uXSxcbiAgICBnZXROb2RlczogcGF0aCA9PiBbcGF0aC5ub2RlLmNhbGxlZV0uY29uY2F0KHBhdGgubm9kZS5hcmd1bWVudHMpLFxuICB9LFxuXG4gIC8vIGZvby5kZWNsYXJlZDtcbiAge1xuICAgIHNlYXJjaFRlcm1zOiBbanNjcy5NZW1iZXJFeHByZXNzaW9uXSxcbiAgICBnZXROb2RlczogcGF0aCA9PiBbcGF0aC5ub2RlLm9iamVjdF0sXG4gIH0sXG5cbiAgLy8gZm9vID0gYmFyO1xuICB7XG4gICAgc2VhcmNoVGVybXM6IFtqc2NzLkFzc2lnbm1lbnRFeHByZXNzaW9uXSxcbiAgICBnZXROb2RlczogcGF0aCA9PiBbcGF0aC5ub2RlLmxlZnQsIHBhdGgubm9kZS5yaWdodF0sXG4gIH0sXG5cbiAgLy8gY2xhc3MgZGVjbGFyZWQgZXh0ZW5kcyBmb28ge31cbiAge1xuICAgIHNlYXJjaFRlcm1zOiBbanNjcy5DbGFzc0RlY2xhcmF0aW9uXSxcbiAgICBnZXROb2RlczogcGF0aCA9PiBbcGF0aC5ub2RlLnN1cGVyQ2xhc3NdLFxuICB9LFxuXG4gIC8vIHZhciBkZWNsYXJlZCA9IGZvbztcbiAge1xuICAgIHNlYXJjaFRlcm1zOiBbanNjcy5WYXJpYWJsZURlY2xhcmF0b3JdLFxuICAgIGdldE5vZGVzOiBwYXRoID0+IFtwYXRoLm5vZGUuaW5pdF0sXG4gIH0sXG5cbiAgLy8gc3dpdGNoIChkZWNsYXJlZCkgeyBjYXNlIGZvbzogYnJlYWs7IH1cbiAge1xuICAgIHNlYXJjaFRlcm1zOiBbanNjcy5Td2l0Y2hDYXNlXSxcbiAgICBnZXROb2RlczogcGF0aCA9PiBbcGF0aC5ub2RlLnRlc3RdLFxuICB9LFxuXG4gIC8vIHtkZWNsYXJlZDogZm9vfVxuICB7XG4gICAgc2VhcmNoVGVybXM6IFtqc2NzLk9iamVjdEV4cHJlc3Npb25dLFxuICAgIC8vIEdlbmVyYWxseSBwcm9wcyBoYXZlIGEgdmFsdWUsIGlmIGl0IGlzIGEgc3ByZWFkIHByb3BlcnR5IGl0IGRvZXNuJ3QuXG4gICAgZ2V0Tm9kZXM6IHBhdGggPT4gcGF0aC5ub2RlLnByb3BlcnRpZXMubWFwKHByb3AgPT4gcHJvcC52YWx1ZSB8fCBwcm9wKSxcbiAgfSxcblxuICAvLyByZXR1cm4gZm9vO1xuICB7XG4gICAgc2VhcmNoVGVybXM6IFtqc2NzLlJldHVyblN0YXRlbWVudF0sXG4gICAgZ2V0Tm9kZXM6IHBhdGggPT4gW3BhdGgubm9kZS5hcmd1bWVudF0sXG4gIH0sXG5cbiAgLy8gaWYgKGZvbykge31cbiAge1xuICAgIHNlYXJjaFRlcm1zOiBbanNjcy5JZlN0YXRlbWVudF0sXG4gICAgZ2V0Tm9kZXM6IHBhdGggPT4gW3BhdGgubm9kZS50ZXN0XSxcbiAgfSxcblxuICAvLyBzd2l0Y2ggKGZvbykge31cbiAge1xuICAgIHNlYXJjaFRlcm1zOiBbanNjcy5Td2l0Y2hTdGF0ZW1lbnRdLFxuICAgIGdldE5vZGVzOiBwYXRoID0+IFtwYXRoLm5vZGUuZGlzY3JpbWluYW50XSxcbiAgfSxcblxuICAvLyAhZm9vO1xuICB7XG4gICAgc2VhcmNoVGVybXM6IFtqc2NzLlVuYXJ5RXhwcmVzc2lvbl0sXG4gICAgZ2V0Tm9kZXM6IHBhdGggPT4gW3BhdGgubm9kZS5hcmd1bWVudF0sXG4gIH0sXG5cbiAgLy8gZm9vIHx8IGJhcjtcbiAge1xuICAgIHNlYXJjaFRlcm1zOiBbanNjcy5CaW5hcnlFeHByZXNzaW9uXSxcbiAgICBnZXROb2RlczogcGF0aCA9PiBbcGF0aC5ub2RlLmxlZnQsIHBhdGgubm9kZS5yaWdodF0sXG4gIH0sXG5cbiAgLy8gZm9vIDwgYmFyO1xuICB7XG4gICAgc2VhcmNoVGVybXM6IFtqc2NzLkxvZ2ljYWxFeHByZXNzaW9uXSxcbiAgICBnZXROb2RlczogcGF0aCA9PiBbcGF0aC5ub2RlLmxlZnQsIHBhdGgubm9kZS5yaWdodF0sXG4gIH0sXG5cbiAgLy8gZm9vID8gYmFyIDogYmF6O1xuICB7XG4gICAgc2VhcmNoVGVybXM6IFtqc2NzLkNvbmRpdGlvbmFsRXhwcmVzc2lvbl0sXG4gICAgZ2V0Tm9kZXM6IHBhdGggPT4gW1xuICAgICAgcGF0aC5ub2RlLnRlc3QsXG4gICAgICBwYXRoLm5vZGUuYWx0ZXJuYXRlLFxuICAgICAgcGF0aC5ub2RlLmNvbnNlcXVlbnQsXG4gICAgXSxcbiAgfSxcblxuICAvLyBuZXcgRm9vKClcbiAge1xuICAgIHNlYXJjaFRlcm1zOiBbanNjcy5OZXdFeHByZXNzaW9uXSxcbiAgICBnZXROb2RlczogcGF0aCA9PiBbcGF0aC5ub2RlLmNhbGxlZV0uY29uY2F0KHBhdGgubm9kZS5hcmd1bWVudHMpLFxuICB9LFxuXG4gIC8vIGZvbysrO1xuICB7XG4gICAgc2VhcmNoVGVybXM6IFtqc2NzLlVwZGF0ZUV4cHJlc3Npb25dLFxuICAgIGdldE5vZGVzOiBwYXRoID0+IFtwYXRoLm5vZGUuYXJndW1lbnRdLFxuICB9LFxuXG4gIC8vIDxFbGVtZW50IGF0dHJpYnV0ZT17Zm9vfSAvPlxuICB7XG4gICAgc2VhcmNoVGVybXM6IFtqc2NzLkpTWEV4cHJlc3Npb25Db250YWluZXJdLFxuICAgIGdldE5vZGVzOiBwYXRoID0+IFtwYXRoLm5vZGUuZXhwcmVzc2lvbl0sXG4gIH0sXG5cbiAgLy8gZm9yIChmb28gaW4gYmFyKSB7fVxuICB7XG4gICAgc2VhcmNoVGVybXM6IFtqc2NzLkZvckluU3RhdGVtZW50XSxcbiAgICBnZXROb2RlczogcGF0aCA9PiBbcGF0aC5ub2RlLmxlZnQsIHBhdGgubm9kZS5yaWdodF0sXG4gIH0sXG5cbiAgLy8gZm9yIChmb28gb2YgYmFyKSB7fVxuICB7XG4gICAgc2VhcmNoVGVybXM6IFtqc2NzLkZvck9mU3RhdGVtZW50XSxcbiAgICBnZXROb2RlczogcGF0aCA9PiBbcGF0aC5ub2RlLmxlZnQsIHBhdGgubm9kZS5yaWdodF0sXG4gIH0sXG5cbiAgLy8gZm9yIChmb287IGJhcjsgYmF6KSB7fVxuICB7XG4gICAgc2VhcmNoVGVybXM6IFtqc2NzLkZvclN0YXRlbWVudF0sXG4gICAgZ2V0Tm9kZXM6IHBhdGggPT4gW3BhdGgubm9kZS5pbml0LCBwYXRoLm5vZGUudGVzdCwgcGF0aC5ub2RlLnVwZGF0ZV0sXG4gIH0sXG5cbiAgLy8gd2hpbGUgKGZvbykge31cbiAge1xuICAgIHNlYXJjaFRlcm1zOiBbanNjcy5XaGlsZVN0YXRlbWVudF0sXG4gICAgZ2V0Tm9kZXM6IHBhdGggPT4gW3BhdGgubm9kZS50ZXN0XSxcbiAgfSxcblxuICAvLyBkbyB7fSB3aGlsZSAoZm9vKVxuICB7XG4gICAgc2VhcmNoVGVybXM6IFtqc2NzLkRvV2hpbGVTdGF0ZW1lbnRdLFxuICAgIGdldE5vZGVzOiBwYXRoID0+IFtwYXRoLm5vZGUudGVzdF0sXG4gIH0sXG5cbiAgLy8gW2Zvb11cbiAge1xuICAgIHNlYXJjaFRlcm1zOiBbanNjcy5BcnJheUV4cHJlc3Npb25dLFxuICAgIGdldE5vZGVzOiBwYXRoID0+IHBhdGgubm9kZS5lbGVtZW50cyxcbiAgfSxcblxuICAvLyBTcGVjaWFsIGNhc2UuIEFueSBKU1ggZWxlbWVudHMgd2lsbCBnZXQgdHJhbnNwaWxlZCB0byB1c2UgUmVhY3QuXG4gIHtcbiAgICBzZWFyY2hUZXJtczogW2pzY3MuSlNYT3BlbmluZ0VsZW1lbnRdLFxuICAgIGdldE5vZGVzOiBwYXRoID0+IFtSRUFDVF9OT0RFXSxcbiAgfSxcblxuICAvLyBmb29gc29tZXRoaW5nYFxuICB7XG4gICAgc2VhcmNoVGVybXM6IFtqc2NzLlRhZ2dlZFRlbXBsYXRlRXhwcmVzc2lvbl0sXG4gICAgZ2V0Tm9kZXM6IHBhdGggPT4gW3BhdGgubm9kZS50YWddLFxuICB9LFxuXG4gIC8vIGAke2Jhcn1gXG4gIHtcbiAgICBzZWFyY2hUZXJtczogW2pzY3MuVGVtcGxhdGVMaXRlcmFsXSxcbiAgICBnZXROb2RlczogcGF0aCA9PiBwYXRoLm5vZGUuZXhwcmVzc2lvbnMsXG4gIH0sXG5cbiAgLy8gZnVuY3Rpb24gZm9vKGEgPSBiKSB7fVxuICB7XG4gICAgc2VhcmNoVGVybXM6IFtqc2NzLkFzc2lnbm1lbnRQYXR0ZXJuXSxcbiAgICBnZXROb2RlczogcGF0aCA9PiBbcGF0aC5ub2RlLnJpZ2h0XSxcbiAgfSxcbl07XG5cbi8qKlxuICogVGhpcyB3aWxsIGdldCBhIGxpc3Qgb2YgYWxsIGlkZW50aWZpZXJzIHRoYXQgYXJlIG5vdCBmcm9tIGEgZGVjbGFyYXRpb24uXG4gKlxuICogTk9URTogdGhpcyBjYW4gZ2V0IGlkZW50aWZpZXJzIHRoYXQgYXJlIGRlY2xhcmVkLCBpZiB5b3Ugd2FudCBhY2Nlc3MgdG9cbiAqIGlkZW50aWZpZXJzIHRoYXQgYXJlIGFjY2VzcyBidXQgdW5kZWNsYXJlZCBzZWUgZ2V0VW5kZWNsYXJlZElkZW50aWZpZXJzXG4gKi9cbmZ1bmN0aW9uIGdldE5vbkRlY2xhcmF0aW9uSWRlbnRpZmllcnMocm9vdDogQ29sbGVjdGlvbik6IFNldDxzdHJpbmc+IHtcbiAgY29uc3QgaWRzID0gbmV3IFNldCgpO1xuICBDT05GSUcuZm9yRWFjaChjb25maWcgPT4ge1xuICAgIHJvb3RcbiAgICAgIC5maW5kKGNvbmZpZy5zZWFyY2hUZXJtc1swXSwgY29uZmlnLnNlYXJjaFRlcm1zWzFdKVxuICAgICAgLmZvckVhY2gocGF0aCA9PiB7XG4gICAgICAgIGNvbnN0IG5vZGVzID0gY29uZmlnLmdldE5vZGVzKHBhdGgpO1xuICAgICAgICBub2Rlcy5mb3JFYWNoKG5vZGUgPT4ge1xuICAgICAgICAgIGNvbnN0IG5hbWVzID0gZ2V0TmFtZXNGcm9tSUQobm9kZSk7XG4gICAgICAgICAgZm9yIChjb25zdCBuYW1lIG9mIG5hbWVzKSB7XG4gICAgICAgICAgICBpZHMuYWRkKG5hbWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgfSk7XG4gIHJldHVybiBpZHM7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0Tm9uRGVjbGFyYXRpb25JZGVudGlmaWVycztcbiJdfQ==