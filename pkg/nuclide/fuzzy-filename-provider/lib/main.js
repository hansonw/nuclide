var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _client = require('../../client');

var providerInstance = undefined;
function getProviderInstance() {
  if (providerInstance == null) {
    var FuzzyFileNameProvider = require('./FuzzyFileNameProvider');
    providerInstance = _extends({}, FuzzyFileNameProvider);
  }
  return providerInstance;
}

var Activation = (function () {
  function Activation(state) {
    _classCallCheck(this, Activation);

    this._disposables = new _atom.CompositeDisposable();
  }

  _createClass(Activation, [{
    key: 'activate',
    value: function activate() {
      // Do search preprocessing for all existing and future root directories.
      initSearch(atom.project.getPaths());
      this._disposables.add(atom.project.onDidChangePaths(initSearch));
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this._disposables.dispose();
    }
  }]);

  return Activation;
})();

var activation = null;
function getActivation() {
  if (activation == null) {
    activation = new Activation();
    activation.activate();
  }
  return activation;
}
var projectRoots = new Set();

/**
 * @param projectPaths All the root directories in the Atom workspace.
 */
function initSearch(projectPaths) {
  var newProjectRoots = new Set();
  projectPaths.forEach(function (projectPath) {
    newProjectRoots.add(projectPath);
    if (projectRoots.has(projectPath)) {
      return;
    }
    var service = (0, _client.getServiceByNuclideUri)('FuzzyFileSearchService', projectPath);
    if (service) {
      // It doesn't matter what the search term is. Empirically, doing an initial
      // search speeds up the next search much more than simply doing the setup
      // kicked off by 'fileSearchForDirectory'.
      service.isFuzzySearchAvailableFor(projectPath).then(function (isAvailable) {
        if (isAvailable) {
          service.queryFuzzyFile(projectPath, 'a');
        }
      });
    }
  });
  projectRoots = newProjectRoots;
}

module.exports = {
  registerProvider: function registerProvider() {
    return getProviderInstance();
  },

  activate: function activate(state) {
    getActivation();
  },

  deactivate: function deactivate() {
    if (activation) {
      activation.dispose();
      activation = null;
    }
  }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7b0JBbUJPLE1BQU07O3NCQUV3QixjQUFjOztBQUVuRCxJQUFJLGdCQUEyQixZQUFBLENBQUM7QUFDaEMsU0FBUyxtQkFBbUIsR0FBYTtBQUN2QyxNQUFJLGdCQUFnQixJQUFJLElBQUksRUFBRTtBQUM1QixRQUFNLHFCQUFxQixHQUFHLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0FBQ2pFLG9CQUFnQixnQkFBTyxxQkFBcUIsQ0FBQyxDQUFDO0dBQy9DO0FBQ0QsU0FBTyxnQkFBZ0IsQ0FBQztDQUN6Qjs7SUFFSyxVQUFVO0FBR0gsV0FIUCxVQUFVLENBR0YsS0FBYyxFQUFFOzBCQUh4QixVQUFVOztBQUlaLFFBQUksQ0FBQyxZQUFZLEdBQUcsK0JBQXlCLENBQUM7R0FDL0M7O2VBTEcsVUFBVTs7V0FPTixvQkFBRzs7QUFFVCxnQkFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztBQUNwQyxVQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7S0FDbEU7OztXQUVNLG1CQUFHO0FBQ1IsVUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsQ0FBQztLQUM3Qjs7O1NBZkcsVUFBVTs7O0FBa0JoQixJQUFJLFVBQXVCLEdBQUcsSUFBSSxDQUFDO0FBQ25DLFNBQVMsYUFBYSxHQUFHO0FBQ3ZCLE1BQUksVUFBVSxJQUFJLElBQUksRUFBRTtBQUN0QixjQUFVLEdBQUcsSUFBSSxVQUFVLEVBQUUsQ0FBQztBQUM5QixjQUFVLENBQUMsUUFBUSxFQUFFLENBQUM7R0FDdkI7QUFDRCxTQUFPLFVBQVUsQ0FBQztDQUNuQjtBQUNELElBQUksWUFBeUIsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDOzs7OztBQUsxQyxTQUFTLFVBQVUsQ0FBQyxZQUEyQixFQUFRO0FBQ3JELE1BQU0sZUFBZSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7QUFDbEMsY0FBWSxDQUFDLE9BQU8sQ0FBQyxVQUFBLFdBQVcsRUFBSTtBQUNsQyxtQkFBZSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUNqQyxRQUFJLFlBQVksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLEVBQUU7QUFDakMsYUFBTztLQUNSO0FBQ0QsUUFBTSxPQUFnQyxHQUFHLG9DQUN2Qyx3QkFBd0IsRUFBRSxXQUFXLENBQUMsQ0FBQztBQUN6QyxRQUFJLE9BQU8sRUFBRTs7OztBQUlYLGFBQU8sQ0FBQyx5QkFBeUIsQ0FBQyxXQUFXLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQSxXQUFXLEVBQUk7QUFDakUsWUFBSSxXQUFXLEVBQUU7QUFDZixpQkFBTyxDQUFDLGNBQWMsQ0FBQyxXQUFXLEVBQUUsR0FBRyxDQUFDLENBQUM7U0FDMUM7T0FDRixDQUFDLENBQUM7S0FDSjtHQUNGLENBQUMsQ0FBQztBQUNILGNBQVksR0FBRyxlQUFlLENBQUM7Q0FDaEM7O0FBRUQsTUFBTSxDQUFDLE9BQU8sR0FBRztBQUNmLGtCQUFnQixFQUFBLDRCQUFhO0FBQzNCLFdBQU8sbUJBQW1CLEVBQUUsQ0FBQztHQUM5Qjs7QUFFRCxVQUFRLEVBQUEsa0JBQUMsS0FBYyxFQUFFO0FBQ3ZCLGlCQUFhLEVBQUUsQ0FBQztHQUNqQjs7QUFFRCxZQUFVLEVBQUEsc0JBQUc7QUFDWCxRQUFJLFVBQVUsRUFBRTtBQUNkLGdCQUFVLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDckIsZ0JBQVUsR0FBRyxJQUFJLENBQUM7S0FDbkI7R0FDRjtDQUNGLENBQUMiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuLyogQGZsb3cgKi9cblxuLypcbiAqIENvcHlyaWdodCAoYykgMjAxNS1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBsaWNlbnNlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgaW5cbiAqIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbmltcG9ydCB0eXBlIHtcbiAgUHJvdmlkZXIsXG59IGZyb20gJy4uLy4uL3F1aWNrLW9wZW4taW50ZXJmYWNlcyc7XG5cbmltcG9ydCB0eXBlb2YgKiBhcyBGdXp6eUZpbGVTZWFyY2hTZXJ2aWNlIGZyb20gJy4uLy4uL2Z1enp5LWZpbGUtc2VhcmNoLXNlcnZpY2UnO1xuXG5pbXBvcnQge1xuICBDb21wb3NpdGVEaXNwb3NhYmxlLFxufSBmcm9tICdhdG9tJztcblxuaW1wb3J0IHtnZXRTZXJ2aWNlQnlOdWNsaWRlVXJpfSBmcm9tICcuLi8uLi9jbGllbnQnO1xuXG5sZXQgcHJvdmlkZXJJbnN0YW5jZTogP1Byb3ZpZGVyO1xuZnVuY3Rpb24gZ2V0UHJvdmlkZXJJbnN0YW5jZSgpOiBQcm92aWRlciB7XG4gIGlmIChwcm92aWRlckluc3RhbmNlID09IG51bGwpIHtcbiAgICBjb25zdCBGdXp6eUZpbGVOYW1lUHJvdmlkZXIgPSByZXF1aXJlKCcuL0Z1enp5RmlsZU5hbWVQcm92aWRlcicpO1xuICAgIHByb3ZpZGVySW5zdGFuY2UgPSB7Li4uRnV6enlGaWxlTmFtZVByb3ZpZGVyfTtcbiAgfVxuICByZXR1cm4gcHJvdmlkZXJJbnN0YW5jZTtcbn1cblxuY2xhc3MgQWN0aXZhdGlvbiB7XG4gIF9kaXNwb3NhYmxlczogQ29tcG9zaXRlRGlzcG9zYWJsZTtcblxuICBjb25zdHJ1Y3RvcihzdGF0ZTogP09iamVjdCkge1xuICAgIHRoaXMuX2Rpc3Bvc2FibGVzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcbiAgfVxuXG4gIGFjdGl2YXRlKCkge1xuICAgIC8vIERvIHNlYXJjaCBwcmVwcm9jZXNzaW5nIGZvciBhbGwgZXhpc3RpbmcgYW5kIGZ1dHVyZSByb290IGRpcmVjdG9yaWVzLlxuICAgIGluaXRTZWFyY2goYXRvbS5wcm9qZWN0LmdldFBhdGhzKCkpO1xuICAgIHRoaXMuX2Rpc3Bvc2FibGVzLmFkZChhdG9tLnByb2plY3Qub25EaWRDaGFuZ2VQYXRocyhpbml0U2VhcmNoKSk7XG4gIH1cblxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMuX2Rpc3Bvc2FibGVzLmRpc3Bvc2UoKTtcbiAgfVxufVxuXG5sZXQgYWN0aXZhdGlvbjogP0FjdGl2YXRpb24gPSBudWxsO1xuZnVuY3Rpb24gZ2V0QWN0aXZhdGlvbigpIHtcbiAgaWYgKGFjdGl2YXRpb24gPT0gbnVsbCkge1xuICAgIGFjdGl2YXRpb24gPSBuZXcgQWN0aXZhdGlvbigpO1xuICAgIGFjdGl2YXRpb24uYWN0aXZhdGUoKTtcbiAgfVxuICByZXR1cm4gYWN0aXZhdGlvbjtcbn1cbmxldCBwcm9qZWN0Um9vdHM6IFNldDxzdHJpbmc+ID0gbmV3IFNldCgpO1xuXG4vKipcbiAqIEBwYXJhbSBwcm9qZWN0UGF0aHMgQWxsIHRoZSByb290IGRpcmVjdG9yaWVzIGluIHRoZSBBdG9tIHdvcmtzcGFjZS5cbiAqL1xuZnVuY3Rpb24gaW5pdFNlYXJjaChwcm9qZWN0UGF0aHM6IEFycmF5PHN0cmluZz4pOiB2b2lkIHtcbiAgY29uc3QgbmV3UHJvamVjdFJvb3RzID0gbmV3IFNldCgpO1xuICBwcm9qZWN0UGF0aHMuZm9yRWFjaChwcm9qZWN0UGF0aCA9PiB7XG4gICAgbmV3UHJvamVjdFJvb3RzLmFkZChwcm9qZWN0UGF0aCk7XG4gICAgaWYgKHByb2plY3RSb290cy5oYXMocHJvamVjdFBhdGgpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHNlcnZpY2U6ID9GdXp6eUZpbGVTZWFyY2hTZXJ2aWNlID0gZ2V0U2VydmljZUJ5TnVjbGlkZVVyaShcbiAgICAgICdGdXp6eUZpbGVTZWFyY2hTZXJ2aWNlJywgcHJvamVjdFBhdGgpO1xuICAgIGlmIChzZXJ2aWNlKSB7XG4gICAgICAvLyBJdCBkb2Vzbid0IG1hdHRlciB3aGF0IHRoZSBzZWFyY2ggdGVybSBpcy4gRW1waXJpY2FsbHksIGRvaW5nIGFuIGluaXRpYWxcbiAgICAgIC8vIHNlYXJjaCBzcGVlZHMgdXAgdGhlIG5leHQgc2VhcmNoIG11Y2ggbW9yZSB0aGFuIHNpbXBseSBkb2luZyB0aGUgc2V0dXBcbiAgICAgIC8vIGtpY2tlZCBvZmYgYnkgJ2ZpbGVTZWFyY2hGb3JEaXJlY3RvcnknLlxuICAgICAgc2VydmljZS5pc0Z1enp5U2VhcmNoQXZhaWxhYmxlRm9yKHByb2plY3RQYXRoKS50aGVuKGlzQXZhaWxhYmxlID0+IHtcbiAgICAgICAgaWYgKGlzQXZhaWxhYmxlKSB7XG4gICAgICAgICAgc2VydmljZS5xdWVyeUZ1enp5RmlsZShwcm9qZWN0UGF0aCwgJ2EnKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbiAgcHJvamVjdFJvb3RzID0gbmV3UHJvamVjdFJvb3RzO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgcmVnaXN0ZXJQcm92aWRlcigpOiBQcm92aWRlciB7XG4gICAgcmV0dXJuIGdldFByb3ZpZGVySW5zdGFuY2UoKTtcbiAgfSxcblxuICBhY3RpdmF0ZShzdGF0ZTogP09iamVjdCkge1xuICAgIGdldEFjdGl2YXRpb24oKTtcbiAgfSxcblxuICBkZWFjdGl2YXRlKCkge1xuICAgIGlmIChhY3RpdmF0aW9uKSB7XG4gICAgICBhY3RpdmF0aW9uLmRpc3Bvc2UoKTtcbiAgICAgIGFjdGl2YXRpb24gPSBudWxsO1xuICAgIH1cbiAgfSxcbn07XG4iXX0=