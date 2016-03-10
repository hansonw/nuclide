var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _analytics = require('../../../analytics');

// This must match the value in diagnostics-table.less.

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

var DiagnosticsPane = require('./DiagnosticsPane');

var _require = require('../../../ui/panel');

var PanelComponent = _require.PanelComponent;

var _require2 = require('react-for-atom');

var React = _require2.React;
var PropTypes = React.PropTypes;
var PANEL_HEADER_HEIGHT_IN_PX = 28;

// This must match the value in panel-component.less.
var RESIZE_HANDLER_HEIGHT_IN_PX = 4;

var keyboardShortcut = null;
function getKeyboardShortcut() {
  if (keyboardShortcut != null) {
    return keyboardShortcut;
  }

  var matchingKeyBindings = atom.keymaps.findKeyBindings({
    command: 'nuclide-diagnostics-ui:toggle-table'
  });
  if (matchingKeyBindings.length && matchingKeyBindings[0].keystrokes) {
    var _require3 = require('../../../keystroke-label');

    var humanizeKeystroke = _require3.humanizeKeystroke;

    keyboardShortcut = humanizeKeystroke(matchingKeyBindings[0].keystrokes);
  } else {
    keyboardShortcut = '';
  }
  return keyboardShortcut;
}

/**
 * Dismissable panel that displays the diagnostics from nuclide-diagnostics-store.
 */

var DiagnosticsPanel = (function (_React$Component) {
  _inherits(DiagnosticsPanel, _React$Component);

  _createClass(DiagnosticsPanel, null, [{
    key: 'propTypes',
    value: {
      diagnostics: PropTypes.array.isRequired,
      height: PropTypes.number.isRequired,
      onDismiss: PropTypes.func.isRequired,
      onResize: PropTypes.func.isRequired,
      width: PropTypes.number.isRequired,
      pathToActiveTextEditor: PropTypes.string,
      filterByActiveTextEditor: PropTypes.bool.isRequired,
      onFilterByActiveTextEditorChange: PropTypes.func.isRequired,
      warnAboutLinter: PropTypes.bool.isRequired,
      disableLinter: PropTypes.func.isRequired
    },
    enumerable: true
  }]);

  function DiagnosticsPanel(props) {
    _classCallCheck(this, DiagnosticsPanel);

    _get(Object.getPrototypeOf(DiagnosticsPanel.prototype), 'constructor', this).call(this, props);
    this._onFilterByActiveTextEditorChange = this._onFilterByActiveTextEditorChange.bind(this);
  }

  _createClass(DiagnosticsPanel, [{
    key: 'getHeight',
    value: function getHeight() {
      return this.refs['panel'].getLength();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this = this;

      var warningCount = 0;
      var errorCount = 0;
      var diagnostics = this.props.diagnostics;

      if (this.props.filterByActiveTextEditor && this.props.pathToActiveTextEditor) {
        (function () {
          var pathToFilterBy = _this.props.pathToActiveTextEditor;
          diagnostics = diagnostics.filter(function (diagnostic) {
            return diagnostic.filePath === pathToFilterBy;
          });
        })();
      }
      diagnostics.forEach(function (diagnostic) {
        if (diagnostic.type === 'Error') {
          ++errorCount;
        } else if (diagnostic.type === 'Warning') {
          ++warningCount;
        }
      });

      var panelHeight = this.props.height;
      var paneHeight = panelHeight - PANEL_HEADER_HEIGHT_IN_PX - RESIZE_HANDLER_HEIGHT_IN_PX;

      var shortcut = getKeyboardShortcut();
      var shortcutSpan = null;
      if (shortcut) {
        shortcutSpan = React.createElement(
          'span',
          { className: 'text-subtle inline-block' },
          'Use ',
          React.createElement(
            'kbd',
            { className: 'key-binding key-binding-sm text-highlight' },
            getKeyboardShortcut()
          ),
          ' to toggle this panel.'
        );
      }

      var linterWarning = null;
      if (this.props.warnAboutLinter) {
        linterWarning = React.createElement(
          'div',
          { className: 'nuclide-diagnostics-pane-linter-warning' },
          React.createElement(
            'span',
            null,
            'nuclide-diagnostics is not compatible with the linter package. We recommend that you ',
            React.createElement(
              'a',
              { onClick: this.props.disableLinter },
              'disable the linter package'
            ),
            '. ',
            React.createElement(
              'a',
              { href: 'https://github.com/facebook/nuclide/tree/master/pkg/nuclide/diagnostics' },
              'Learn More'
            ),
            '.'
          )
        );
      }

      var errorSpanClassName = 'inline-block ' + (errorCount > 0 ? 'text-error' : '');
      var warningSpanClassName = 'inline-block ' + (warningCount > 0 ? 'text-warning' : '');

      // We hide the horizontal overflow in the PanelComponent because the presence of the scrollbar
      // throws off our height calculations.
      return React.createElement(
        PanelComponent,
        {
          ref: 'panel',
          dock: 'bottom',
          initialLength: panelHeight,
          onResize: this.props.onResize,
          overflowX: 'hidden' },
        React.createElement(
          'div',
          null,
          linterWarning,
          React.createElement(
            'div',
            { className: 'nuclide-diagnostics-pane-nav' },
            React.createElement(
              'div',
              { className: 'nuclide-diagnostics-pane-nav-left' },
              React.createElement(
                'span',
                { className: errorSpanClassName },
                'Errors: ',
                errorCount
              ),
              React.createElement(
                'span',
                { className: warningSpanClassName },
                'Warnings: ',
                warningCount
              ),
              React.createElement(
                'span',
                { className: 'inline-block' },
                React.createElement(
                  'label',
                  { className: 'nuclide-diagnostics-label' },
                  React.createElement('input', {
                    type: 'checkbox',
                    checked: this.props.filterByActiveTextEditor,
                    onChange: this._onFilterByActiveTextEditorChange
                  }),
                  '  Show only diagnostics for current file.'
                )
              )
            ),
            React.createElement(
              'div',
              { className: 'nuclide-diagnostics-pane-nav-right' },
              shortcutSpan,
              React.createElement('button', {
                onClick: this.props.onDismiss,
                className: 'btn btn-subtle btn-sm icon icon-x inline-block',
                title: 'Close Panel'
              })
            )
          ),
          React.createElement(DiagnosticsPane, {
            showFileName: !this.props.filterByActiveTextEditor,
            diagnostics: diagnostics,
            height: paneHeight,
            width: this.props.width
          })
        )
      );
    }
  }, {
    key: '_onFilterByActiveTextEditorChange',
    value: function _onFilterByActiveTextEditorChange(event) {
      var isChecked = event.target.checked;
      (0, _analytics.track)('diagnostics-panel-toggle-current-file', { isChecked: isChecked.toString() });
      this.props.onFilterByActiveTextEditorChange.call(null, isChecked);
    }
  }]);

  return DiagnosticsPanel;
})(React.Component);

module.exports = DiagnosticsPanel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkRpYWdub3N0aWNzUGFuZWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7eUJBZ0JvQixvQkFBb0I7Ozs7Ozs7Ozs7OztBQUx4QyxJQUFNLGVBQWUsR0FBRyxPQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQzs7ZUFDNUIsT0FBTyxDQUFDLG1CQUFtQixDQUFDOztJQUE5QyxjQUFjLFlBQWQsY0FBYzs7Z0JBQ0wsT0FBTyxDQUFDLGdCQUFnQixDQUFDOztJQUFsQyxLQUFLLGFBQUwsS0FBSztJQUNMLFNBQVMsR0FBSSxLQUFLLENBQWxCLFNBQVM7QUFLaEIsSUFBTSx5QkFBeUIsR0FBRyxFQUFFLENBQUM7OztBQUdyQyxJQUFNLDJCQUEyQixHQUFHLENBQUMsQ0FBQzs7QUFFdEMsSUFBSSxnQkFBeUIsR0FBRyxJQUFJLENBQUM7QUFDckMsU0FBUyxtQkFBbUIsR0FBVztBQUNyQyxNQUFJLGdCQUFnQixJQUFJLElBQUksRUFBRTtBQUM1QixXQUFPLGdCQUFnQixDQUFDO0dBQ3pCOztBQUVELE1BQU0sbUJBQW1CLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUM7QUFDdkQsV0FBTyxFQUFFLHFDQUFxQztHQUMvQyxDQUFDLENBQUM7QUFDSCxNQUFJLG1CQUFtQixDQUFDLE1BQU0sSUFBSSxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUU7b0JBQ3ZDLE9BQU8sQ0FBQywwQkFBMEIsQ0FBQzs7UUFBeEQsaUJBQWlCLGFBQWpCLGlCQUFpQjs7QUFDeEIsb0JBQWdCLEdBQUcsaUJBQWlCLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUM7R0FDekUsTUFBTTtBQUNMLG9CQUFnQixHQUFHLEVBQUUsQ0FBQztHQUN2QjtBQUNELFNBQU8sZ0JBQWdCLENBQUM7Q0FDekI7Ozs7OztJQU1LLGdCQUFnQjtZQUFoQixnQkFBZ0I7O2VBQWhCLGdCQUFnQjs7V0FDRDtBQUNqQixpQkFBVyxFQUFFLFNBQVMsQ0FBQyxLQUFLLENBQUMsVUFBVTtBQUN2QyxZQUFNLEVBQUUsU0FBUyxDQUFDLE1BQU0sQ0FBQyxVQUFVO0FBQ25DLGVBQVMsRUFBRSxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVU7QUFDcEMsY0FBUSxFQUFFLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVTtBQUNuQyxXQUFLLEVBQUUsU0FBUyxDQUFDLE1BQU0sQ0FBQyxVQUFVO0FBQ2xDLDRCQUFzQixFQUFFLFNBQVMsQ0FBQyxNQUFNO0FBQ3hDLDhCQUF3QixFQUFFLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVTtBQUNuRCxzQ0FBZ0MsRUFBRSxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVU7QUFDM0QscUJBQWUsRUFBRSxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVU7QUFDMUMsbUJBQWEsRUFBRSxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVU7S0FDekM7Ozs7QUFFVSxXQWRQLGdCQUFnQixDQWNSLEtBQVksRUFBRTswQkFkdEIsZ0JBQWdCOztBQWVsQiwrQkFmRSxnQkFBZ0IsNkNBZVosS0FBSyxFQUFFO0FBQ2IsQUFBQyxRQUFJLENBQU8saUNBQWlDLEdBQzNDLElBQUksQ0FBQyxpQ0FBaUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDckQ7O2VBbEJHLGdCQUFnQjs7V0FvQlgscUJBQVc7QUFDbEIsYUFBTyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO0tBQ3ZDOzs7V0FFSyxrQkFBaUI7OztBQUNyQixVQUFJLFlBQVksR0FBRyxDQUFDLENBQUM7QUFDckIsVUFBSSxVQUFVLEdBQUcsQ0FBQyxDQUFDO1VBQ2QsV0FBVyxHQUFJLElBQUksQ0FBQyxLQUFLLENBQXpCLFdBQVc7O0FBQ2hCLFVBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyx3QkFBd0IsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLHNCQUFzQixFQUFFOztBQUM1RSxjQUFNLGNBQWMsR0FBRyxNQUFLLEtBQUssQ0FBQyxzQkFBc0IsQ0FBQztBQUN6RCxxQkFBVyxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUMsVUFBQSxVQUFVO21CQUFJLFVBQVUsQ0FBQyxRQUFRLEtBQUssY0FBYztXQUFBLENBQUMsQ0FBQzs7T0FDeEY7QUFDRCxpQkFBVyxDQUFDLE9BQU8sQ0FBQyxVQUFBLFVBQVUsRUFBSTtBQUNoQyxZQUFJLFVBQVUsQ0FBQyxJQUFJLEtBQUssT0FBTyxFQUFFO0FBQy9CLFlBQUUsVUFBVSxDQUFDO1NBQ2QsTUFBTSxJQUFJLFVBQVUsQ0FBQyxJQUFJLEtBQUssU0FBUyxFQUFFO0FBQ3hDLFlBQUUsWUFBWSxDQUFDO1NBQ2hCO09BQ0YsQ0FBQyxDQUFDOztBQUVILFVBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO0FBQ3RDLFVBQU0sVUFBVSxHQUFHLFdBQVcsR0FBRyx5QkFBeUIsR0FBRywyQkFBMkIsQ0FBQzs7QUFFekYsVUFBTSxRQUFRLEdBQUcsbUJBQW1CLEVBQUUsQ0FBQztBQUN2QyxVQUFJLFlBQVksR0FBRyxJQUFJLENBQUM7QUFDeEIsVUFBSSxRQUFRLEVBQUU7QUFDWixvQkFBWSxHQUNWOztZQUFNLFNBQVMsRUFBQywwQkFBMEI7O1VBQ3BDOztjQUFLLFNBQVMsRUFBQywyQ0FBMkM7WUFDN0QsbUJBQW1CLEVBQUU7V0FDaEI7O1NBQ0QsQUFDUixDQUFDO09BQ0g7O0FBRUQsVUFBSSxhQUFhLEdBQUcsSUFBSSxDQUFDO0FBQ3pCLFVBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLEVBQUU7QUFDOUIscUJBQWEsR0FDWDs7WUFBSyxTQUFTLEVBQUMseUNBQXlDO1VBQ3REOzs7O1lBRU07O2dCQUFHLE9BQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQUFBQzs7YUFBK0I7O1lBQ3hFOztnQkFBRyxJQUFJLEVBQUMseUVBQXlFOzthQUNuRTs7V0FDVDtTQUNILEFBQ1AsQ0FBQztPQUNIOztBQUVELFVBQU0sa0JBQWtCLHNCQUFtQixVQUFVLEdBQUcsQ0FBQyxHQUFHLFlBQVksR0FBRyxFQUFFLENBQUEsQUFBRSxDQUFDO0FBQ2hGLFVBQU0sb0JBQW9CLHNCQUFtQixZQUFZLEdBQUcsQ0FBQyxHQUFHLGNBQWMsR0FBRyxFQUFFLENBQUEsQUFBRSxDQUFDOzs7O0FBSXRGLGFBQ0U7QUFBQyxzQkFBYzs7QUFDYixhQUFHLEVBQUMsT0FBTztBQUNYLGNBQUksRUFBQyxRQUFRO0FBQ2IsdUJBQWEsRUFBRSxXQUFXLEFBQUM7QUFDM0Isa0JBQVEsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQUFBQztBQUM5QixtQkFBUyxFQUFDLFFBQVE7UUFDbEI7OztVQUNHLGFBQWE7VUFDZDs7Y0FBSyxTQUFTLEVBQUMsOEJBQThCO1lBQzNDOztnQkFBSyxTQUFTLEVBQUMsbUNBQW1DO2NBQ2hEOztrQkFBTSxTQUFTLEVBQUUsa0JBQWtCLEFBQUM7O2dCQUN6QixVQUFVO2VBQ2Q7Y0FDUDs7a0JBQU0sU0FBUyxFQUFFLG9CQUFvQixBQUFDOztnQkFDekIsWUFBWTtlQUNsQjtjQUNQOztrQkFBTSxTQUFTLEVBQUMsY0FBYztnQkFDNUI7O29CQUFPLFNBQVMsRUFBQywyQkFBMkI7a0JBQzFDO0FBQ0Usd0JBQUksRUFBQyxVQUFVO0FBQ2YsMkJBQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLHdCQUF3QixBQUFDO0FBQzdDLDRCQUFRLEVBQUUsSUFBSSxDQUFDLGlDQUFpQyxBQUFDO29CQUNqRDs7aUJBR0k7ZUFDSDthQUNIO1lBQ047O2dCQUFLLFNBQVMsRUFBQyxvQ0FBb0M7Y0FDaEQsWUFBWTtjQUNiO0FBQ0UsdUJBQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQUFBQztBQUM5Qix5QkFBUyxFQUFDLGdEQUFnRDtBQUMxRCxxQkFBSyxFQUFDLGFBQWE7Z0JBQ25CO2FBQ0U7V0FDRjtVQUNOLG9CQUFDLGVBQWU7QUFDZCx3QkFBWSxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyx3QkFBd0IsQUFBQztBQUNuRCx1QkFBVyxFQUFFLFdBQVcsQUFBQztBQUN6QixrQkFBTSxFQUFFLFVBQVUsQUFBQztBQUNuQixpQkFBSyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxBQUFDO1lBQ3hCO1NBQ0U7T0FDUyxDQUNqQjtLQUNIOzs7V0FFZ0MsMkNBQUMsS0FBcUIsRUFBRTtBQUN2RCxVQUFNLFNBQVMsR0FBRyxBQUFFLEtBQUssQ0FBQyxNQUFNLENBQTBCLE9BQU8sQ0FBQztBQUNsRSw0QkFBTSx1Q0FBdUMsRUFBRSxFQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsUUFBUSxFQUFFLEVBQUMsQ0FBQyxDQUFDO0FBQ2xGLFVBQUksQ0FBQyxLQUFLLENBQUMsZ0NBQWdDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztLQUNuRTs7O1NBL0hHLGdCQUFnQjtHQUFTLEtBQUssQ0FBQyxTQUFTOztBQWtJOUMsTUFBTSxDQUFDLE9BQU8sR0FBRyxnQkFBZ0IsQ0FBQyIsImZpbGUiOiJEaWFnbm9zdGljc1BhbmVsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG4vKiBAZmxvdyAqL1xuXG4vKlxuICogQ29weXJpZ2h0IChjKSAyMDE1LXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIGxpY2Vuc2UgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBpblxuICogdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuY29uc3QgRGlhZ25vc3RpY3NQYW5lID0gcmVxdWlyZSgnLi9EaWFnbm9zdGljc1BhbmUnKTtcbmNvbnN0IHtQYW5lbENvbXBvbmVudH0gPSByZXF1aXJlKCcuLi8uLi8uLi91aS9wYW5lbCcpO1xuY29uc3Qge1JlYWN0fSA9IHJlcXVpcmUoJ3JlYWN0LWZvci1hdG9tJyk7XG5jb25zdCB7UHJvcFR5cGVzfSA9IFJlYWN0O1xuXG5pbXBvcnQge3RyYWNrfSBmcm9tICcuLi8uLi8uLi9hbmFseXRpY3MnO1xuXG4vLyBUaGlzIG11c3QgbWF0Y2ggdGhlIHZhbHVlIGluIGRpYWdub3N0aWNzLXRhYmxlLmxlc3MuXG5jb25zdCBQQU5FTF9IRUFERVJfSEVJR0hUX0lOX1BYID0gMjg7XG5cbi8vIFRoaXMgbXVzdCBtYXRjaCB0aGUgdmFsdWUgaW4gcGFuZWwtY29tcG9uZW50Lmxlc3MuXG5jb25zdCBSRVNJWkVfSEFORExFUl9IRUlHSFRfSU5fUFggPSA0O1xuXG5sZXQga2V5Ym9hcmRTaG9ydGN1dDogP3N0cmluZyA9IG51bGw7XG5mdW5jdGlvbiBnZXRLZXlib2FyZFNob3J0Y3V0KCk6IHN0cmluZyB7XG4gIGlmIChrZXlib2FyZFNob3J0Y3V0ICE9IG51bGwpIHtcbiAgICByZXR1cm4ga2V5Ym9hcmRTaG9ydGN1dDtcbiAgfVxuXG4gIGNvbnN0IG1hdGNoaW5nS2V5QmluZGluZ3MgPSBhdG9tLmtleW1hcHMuZmluZEtleUJpbmRpbmdzKHtcbiAgICBjb21tYW5kOiAnbnVjbGlkZS1kaWFnbm9zdGljcy11aTp0b2dnbGUtdGFibGUnLFxuICB9KTtcbiAgaWYgKG1hdGNoaW5nS2V5QmluZGluZ3MubGVuZ3RoICYmIG1hdGNoaW5nS2V5QmluZGluZ3NbMF0ua2V5c3Ryb2tlcykge1xuICAgIGNvbnN0IHtodW1hbml6ZUtleXN0cm9rZX0gPSByZXF1aXJlKCcuLi8uLi8uLi9rZXlzdHJva2UtbGFiZWwnKTtcbiAgICBrZXlib2FyZFNob3J0Y3V0ID0gaHVtYW5pemVLZXlzdHJva2UobWF0Y2hpbmdLZXlCaW5kaW5nc1swXS5rZXlzdHJva2VzKTtcbiAgfSBlbHNlIHtcbiAgICBrZXlib2FyZFNob3J0Y3V0ID0gJyc7XG4gIH1cbiAgcmV0dXJuIGtleWJvYXJkU2hvcnRjdXQ7XG59XG5cblxuLyoqXG4gKiBEaXNtaXNzYWJsZSBwYW5lbCB0aGF0IGRpc3BsYXlzIHRoZSBkaWFnbm9zdGljcyBmcm9tIG51Y2xpZGUtZGlhZ25vc3RpY3Mtc3RvcmUuXG4gKi9cbmNsYXNzIERpYWdub3N0aWNzUGFuZWwgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGRpYWdub3N0aWNzOiBQcm9wVHlwZXMuYXJyYXkuaXNSZXF1aXJlZCxcbiAgICBoZWlnaHQ6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICBvbkRpc21pc3M6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgb25SZXNpemU6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgd2lkdGg6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICBwYXRoVG9BY3RpdmVUZXh0RWRpdG9yOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIGZpbHRlckJ5QWN0aXZlVGV4dEVkaXRvcjogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICBvbkZpbHRlckJ5QWN0aXZlVGV4dEVkaXRvckNoYW5nZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICB3YXJuQWJvdXRMaW50ZXI6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gICAgZGlzYWJsZUxpbnRlcjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgfTtcblxuICBjb25zdHJ1Y3Rvcihwcm9wczogbWl4ZWQpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgKHRoaXM6IGFueSkuX29uRmlsdGVyQnlBY3RpdmVUZXh0RWRpdG9yQ2hhbmdlID1cbiAgICAgIHRoaXMuX29uRmlsdGVyQnlBY3RpdmVUZXh0RWRpdG9yQ2hhbmdlLmJpbmQodGhpcyk7XG4gIH1cblxuICBnZXRIZWlnaHQoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5yZWZzWydwYW5lbCddLmdldExlbmd0aCgpO1xuICB9XG5cbiAgcmVuZGVyKCk6IFJlYWN0RWxlbWVudCB7XG4gICAgbGV0IHdhcm5pbmdDb3VudCA9IDA7XG4gICAgbGV0IGVycm9yQ291bnQgPSAwO1xuICAgIGxldCB7ZGlhZ25vc3RpY3N9ID0gdGhpcy5wcm9wcztcbiAgICBpZiAodGhpcy5wcm9wcy5maWx0ZXJCeUFjdGl2ZVRleHRFZGl0b3IgJiYgdGhpcy5wcm9wcy5wYXRoVG9BY3RpdmVUZXh0RWRpdG9yKSB7XG4gICAgICBjb25zdCBwYXRoVG9GaWx0ZXJCeSA9IHRoaXMucHJvcHMucGF0aFRvQWN0aXZlVGV4dEVkaXRvcjtcbiAgICAgIGRpYWdub3N0aWNzID0gZGlhZ25vc3RpY3MuZmlsdGVyKGRpYWdub3N0aWMgPT4gZGlhZ25vc3RpYy5maWxlUGF0aCA9PT0gcGF0aFRvRmlsdGVyQnkpO1xuICAgIH1cbiAgICBkaWFnbm9zdGljcy5mb3JFYWNoKGRpYWdub3N0aWMgPT4ge1xuICAgICAgaWYgKGRpYWdub3N0aWMudHlwZSA9PT0gJ0Vycm9yJykge1xuICAgICAgICArK2Vycm9yQ291bnQ7XG4gICAgICB9IGVsc2UgaWYgKGRpYWdub3N0aWMudHlwZSA9PT0gJ1dhcm5pbmcnKSB7XG4gICAgICAgICsrd2FybmluZ0NvdW50O1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29uc3QgcGFuZWxIZWlnaHQgPSB0aGlzLnByb3BzLmhlaWdodDtcbiAgICBjb25zdCBwYW5lSGVpZ2h0ID0gcGFuZWxIZWlnaHQgLSBQQU5FTF9IRUFERVJfSEVJR0hUX0lOX1BYIC0gUkVTSVpFX0hBTkRMRVJfSEVJR0hUX0lOX1BYO1xuXG4gICAgY29uc3Qgc2hvcnRjdXQgPSBnZXRLZXlib2FyZFNob3J0Y3V0KCk7XG4gICAgbGV0IHNob3J0Y3V0U3BhbiA9IG51bGw7XG4gICAgaWYgKHNob3J0Y3V0KSB7XG4gICAgICBzaG9ydGN1dFNwYW4gPSAoXG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtc3VidGxlIGlubGluZS1ibG9ja1wiPlxuICAgICAgICAgIFVzZSA8a2JkIGNsYXNzTmFtZT1cImtleS1iaW5kaW5nIGtleS1iaW5kaW5nLXNtIHRleHQtaGlnaGxpZ2h0XCI+XG4gICAgICAgICAge2dldEtleWJvYXJkU2hvcnRjdXQoKX1cbiAgICAgICAgICA8L2tiZD4gdG8gdG9nZ2xlIHRoaXMgcGFuZWwuXG4gICAgICAgIDwvc3Bhbj5cbiAgICAgICk7XG4gICAgfVxuXG4gICAgbGV0IGxpbnRlcldhcm5pbmcgPSBudWxsO1xuICAgIGlmICh0aGlzLnByb3BzLndhcm5BYm91dExpbnRlcikge1xuICAgICAgbGludGVyV2FybmluZyA9IChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJudWNsaWRlLWRpYWdub3N0aWNzLXBhbmUtbGludGVyLXdhcm5pbmdcIj5cbiAgICAgICAgICA8c3Bhbj5cbiAgICAgICAgICAgIG51Y2xpZGUtZGlhZ25vc3RpY3MgaXMgbm90IGNvbXBhdGlibGUgd2l0aCB0aGUgbGludGVyIHBhY2thZ2UuIFdlIHJlY29tbWVuZCB0aGF0XG4gICAgICAgICAgICB5b3UgPGEgb25DbGljaz17dGhpcy5wcm9wcy5kaXNhYmxlTGludGVyfT5kaXNhYmxlIHRoZSBsaW50ZXIgcGFja2FnZTwvYT4uJm5ic3A7XG4gICAgICAgICAgICA8YSBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL251Y2xpZGUvdHJlZS9tYXN0ZXIvcGtnL251Y2xpZGUvZGlhZ25vc3RpY3NcIj5cbiAgICAgICAgICAgIExlYXJuIE1vcmU8L2E+LlxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgIH1cblxuICAgIGNvbnN0IGVycm9yU3BhbkNsYXNzTmFtZSA9IGBpbmxpbmUtYmxvY2sgJHtlcnJvckNvdW50ID4gMCA/ICd0ZXh0LWVycm9yJyA6ICcnfWA7XG4gICAgY29uc3Qgd2FybmluZ1NwYW5DbGFzc05hbWUgPSBgaW5saW5lLWJsb2NrICR7d2FybmluZ0NvdW50ID4gMCA/ICd0ZXh0LXdhcm5pbmcnIDogJyd9YDtcblxuICAgIC8vIFdlIGhpZGUgdGhlIGhvcml6b250YWwgb3ZlcmZsb3cgaW4gdGhlIFBhbmVsQ29tcG9uZW50IGJlY2F1c2UgdGhlIHByZXNlbmNlIG9mIHRoZSBzY3JvbGxiYXJcbiAgICAvLyB0aHJvd3Mgb2ZmIG91ciBoZWlnaHQgY2FsY3VsYXRpb25zLlxuICAgIHJldHVybiAoXG4gICAgICA8UGFuZWxDb21wb25lbnRcbiAgICAgICAgcmVmPVwicGFuZWxcIlxuICAgICAgICBkb2NrPVwiYm90dG9tXCJcbiAgICAgICAgaW5pdGlhbExlbmd0aD17cGFuZWxIZWlnaHR9XG4gICAgICAgIG9uUmVzaXplPXt0aGlzLnByb3BzLm9uUmVzaXplfVxuICAgICAgICBvdmVyZmxvd1g9XCJoaWRkZW5cIj5cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICB7bGludGVyV2FybmluZ31cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm51Y2xpZGUtZGlhZ25vc3RpY3MtcGFuZS1uYXZcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibnVjbGlkZS1kaWFnbm9zdGljcy1wYW5lLW5hdi1sZWZ0XCI+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT17ZXJyb3JTcGFuQ2xhc3NOYW1lfT5cbiAgICAgICAgICAgICAgICBFcnJvcnM6IHtlcnJvckNvdW50fVxuICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT17d2FybmluZ1NwYW5DbGFzc05hbWV9PlxuICAgICAgICAgICAgICAgIFdhcm5pbmdzOiB7d2FybmluZ0NvdW50fVxuICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImlubGluZS1ibG9ja1wiPlxuICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJudWNsaWRlLWRpYWdub3N0aWNzLWxhYmVsXCI+XG4gICAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgICAgdHlwZT1cImNoZWNrYm94XCJcbiAgICAgICAgICAgICAgICAgICAgY2hlY2tlZD17dGhpcy5wcm9wcy5maWx0ZXJCeUFjdGl2ZVRleHRFZGl0b3J9XG4gICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLl9vbkZpbHRlckJ5QWN0aXZlVGV4dEVkaXRvckNoYW5nZX1cbiAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAmbmJzcDtcbiAgICAgICAgICAgICAgICAgIFNob3cgb25seSBkaWFnbm9zdGljcyBmb3IgY3VycmVudCBmaWxlLlxuICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJudWNsaWRlLWRpYWdub3N0aWNzLXBhbmUtbmF2LXJpZ2h0XCI+XG4gICAgICAgICAgICAgIHtzaG9ydGN1dFNwYW59XG4gICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLnByb3BzLm9uRGlzbWlzc31cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJidG4gYnRuLXN1YnRsZSBidG4tc20gaWNvbiBpY29uLXggaW5saW5lLWJsb2NrXCJcbiAgICAgICAgICAgICAgICB0aXRsZT1cIkNsb3NlIFBhbmVsXCJcbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxEaWFnbm9zdGljc1BhbmVcbiAgICAgICAgICAgIHNob3dGaWxlTmFtZT17IXRoaXMucHJvcHMuZmlsdGVyQnlBY3RpdmVUZXh0RWRpdG9yfVxuICAgICAgICAgICAgZGlhZ25vc3RpY3M9e2RpYWdub3N0aWNzfVxuICAgICAgICAgICAgaGVpZ2h0PXtwYW5lSGVpZ2h0fVxuICAgICAgICAgICAgd2lkdGg9e3RoaXMucHJvcHMud2lkdGh9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L1BhbmVsQ29tcG9uZW50PlxuICAgICk7XG4gIH1cblxuICBfb25GaWx0ZXJCeUFjdGl2ZVRleHRFZGl0b3JDaGFuZ2UoZXZlbnQ6IFN5bnRoZXRpY0V2ZW50KSB7XG4gICAgY29uc3QgaXNDaGVja2VkID0gKChldmVudC50YXJnZXQ6IGFueSk6IEhUTUxJbnB1dEVsZW1lbnQpLmNoZWNrZWQ7XG4gICAgdHJhY2soJ2RpYWdub3N0aWNzLXBhbmVsLXRvZ2dsZS1jdXJyZW50LWZpbGUnLCB7aXNDaGVja2VkOiBpc0NoZWNrZWQudG9TdHJpbmcoKX0pO1xuICAgIHRoaXMucHJvcHMub25GaWx0ZXJCeUFjdGl2ZVRleHRFZGl0b3JDaGFuZ2UuY2FsbChudWxsLCBpc0NoZWNrZWQpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gRGlhZ25vc3RpY3NQYW5lbDtcbiJdfQ==