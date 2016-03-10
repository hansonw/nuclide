

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

module.exports = {
  activate: function activate() {
    var _require = require('../../../atom-helpers');

    var registerGrammarForFileExtension = _require.registerGrammarForFileExtension;

    registerGrammarForFileExtension('source.python', 'BUCK');
    registerGrammarForFileExtension('source.ini', '.buckconfig');
  },

  deactivate: function deactivate() {},

  getHyperclickProvider: function getHyperclickProvider() {
    return require('./HyperclickProvider');
  }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQVdBLE1BQU0sQ0FBQyxPQUFPLEdBQUc7QUFDZixVQUFRLEVBQUEsb0JBQUc7bUJBQ2lDLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQzs7UUFBbkUsK0JBQStCLFlBQS9CLCtCQUErQjs7QUFDdEMsbUNBQStCLENBQUMsZUFBZSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ3pELG1DQUErQixDQUFDLFlBQVksRUFBRSxhQUFhLENBQUMsQ0FBQztHQUM5RDs7QUFFRCxZQUFVLEVBQUEsc0JBQUcsRUFDWjs7QUFFRCx1QkFBcUIsRUFBQSxpQ0FBRztBQUN0QixXQUFPLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0dBQ3hDO0NBQ0YsQ0FBQyIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG4vKiBAZmxvdyAqL1xuXG4vKlxuICogQ29weXJpZ2h0IChjKSAyMDE1LXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIGxpY2Vuc2UgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBpblxuICogdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGFjdGl2YXRlKCkge1xuICAgIGNvbnN0IHtyZWdpc3RlckdyYW1tYXJGb3JGaWxlRXh0ZW5zaW9ufSA9IHJlcXVpcmUoJy4uLy4uLy4uL2F0b20taGVscGVycycpO1xuICAgIHJlZ2lzdGVyR3JhbW1hckZvckZpbGVFeHRlbnNpb24oJ3NvdXJjZS5weXRob24nLCAnQlVDSycpO1xuICAgIHJlZ2lzdGVyR3JhbW1hckZvckZpbGVFeHRlbnNpb24oJ3NvdXJjZS5pbmknLCAnLmJ1Y2tjb25maWcnKTtcbiAgfSxcblxuICBkZWFjdGl2YXRlKCkge1xuICB9LFxuXG4gIGdldEh5cGVyY2xpY2tQcm92aWRlcigpIHtcbiAgICByZXR1cm4gcmVxdWlyZSgnLi9IeXBlcmNsaWNrUHJvdmlkZXInKTtcbiAgfSxcbn07XG4iXX0=