Object.defineProperty(exports, '__esModule', {
  value: true
});

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _ActionTypes = require('./ActionTypes');

var ActionTypes = _interopRequireWildcard(_ActionTypes);

var _ContainerVisibility = require('./ContainerVisibility');

var ContainerVisibility = _interopRequireWildcard(_ContainerVisibility);

var _createComponentItem = require('./createComponentItem');

var _createComponentItem2 = _interopRequireDefault(_createComponentItem);

var _ExpandedFlexScale = require('./ExpandedFlexScale');

var ExpandedFlexScale = _interopRequireWildcard(_ExpandedFlexScale);

var _findOrCreatePaneItemLocation = require('./findOrCreatePaneItemLocation');

var _findOrCreatePaneItemLocation2 = _interopRequireDefault(_findOrCreatePaneItemLocation);

var _findPaneAndItem = require('./findPaneAndItem');

var _findPaneAndItem2 = _interopRequireDefault(_findPaneAndItem);

var _getContainerToHide = require('./getContainerToHide');

var _getContainerToHide2 = _interopRequireDefault(_getContainerToHide);

var _getResizableContainers = require('./getResizableContainers');

var _getResizableContainers2 = _interopRequireDefault(_getResizableContainers);

var _GadgetPlaceholder = require('./GadgetPlaceholder');

var _GadgetPlaceholder2 = _interopRequireDefault(_GadgetPlaceholder);

var _reactForAtom = require('react-for-atom');

var _shallowequal = require('shallowequal');

var _shallowequal2 = _interopRequireDefault(_shallowequal);

var _wrapGadget = require('./wrapGadget');

var _wrapGadget2 = _interopRequireDefault(_wrapGadget);

/**
 * Create an object that provides commands ("action creators")
 */

var Commands = (function () {
  function Commands(observer, getState) {
    _classCallCheck(this, Commands);

    this._observer = observer;
    this._getState = getState;
  }

  _createClass(Commands, [{
    key: 'deactivate',
    value: function deactivate() {
      this._observer.onNext({
        type: ActionTypes.DEACTIVATE
      });
      this._observer.onCompleted();
    }
  }, {
    key: 'destroyGadget',
    value: function destroyGadget(gadgetId) {
      var match = (0, _findPaneAndItem2['default'])(function (item) {
        return getGadgetId(item) === gadgetId;
      });
      if (match == null) {
        return;
      }
      match.pane.destroyItem(match.item);
    }
  }, {
    key: 'cleanUpDestroyedPaneItem',
    value: function cleanUpDestroyedPaneItem(item) {
      if (!this._getState().get('components').has(item)) {
        return;
      }

      _reactForAtom.ReactDOM.unmountComponentAtNode(item.element);

      this._observer.onNext({
        type: ActionTypes.DESTROY_PANE_ITEM,
        payload: { item: item }
      });
    }

    /**
     * Creates a new pane item for the specified gadget. This is meant to be the single point
     * through which all pane item creation goes (new pane item creation, deserialization,
     * splitting, reopening, etc.).
     */
  }, {
    key: 'createPaneItem',
    value: function createPaneItem(gadgetId, props) {
      var isNew = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

      // Look up the gadget.
      var gadget = this._getState().get('gadgets').get(gadgetId);

      // If there's no gadget registered with the provided ID, abort. Maybe the user just
      // deactivated that package.
      if (gadget == null) {
        return;
      }

      var GadgetComponent = gadget;
      var item = (0, _createComponentItem2['default'])(_reactForAtom.React.createElement(GadgetComponent, props));

      this._observer.onNext({
        type: ActionTypes.CREATE_PANE_ITEM,
        payload: {
          component: GadgetComponent,
          gadgetId: gadgetId,
          item: item,
          props: props,
          isNew: isNew
        }
      });

      return item;
    }
  }, {
    key: 'hideGadget',
    value: function hideGadget(gadgetId) {
      // Hiding a gadget doesn't just mean closing its pane; it means getting it out of the way.
      // Just closing its pane and would potentially leave siblings which, presumably, the user
      // would then have to also close. Instead, it's more useful to identify the group of gadgets
      // to which this one belongs and get it out of the way. Though groups can be nested, the most
      // useful to hide is almost certainly the topmost, so that's what we do.

      var match = (0, _findPaneAndItem2['default'])(function (item) {
        return getGadgetId(item) === gadgetId;
      });

      // If the gadget isn't present, no biggie; just no-op.
      if (match == null) {
        return;
      }

      var gadgetItem = match.item;
      var parentPane = match.pane;

      var containerToHide = (0, _getContainerToHide2['default'])(parentPane);

      // If gadget is at the top level "hiding" is kind of a murky concept but we'll take it to mean
      // "close."
      if (containerToHide == null) {
        parentPane.destroyItem(gadgetItem);

        // TODO: Store the location of the closed pane for serialization so we can reopen this
        //       gadget there next time. (This isn't necessary if the gadget's default location is
        //       at the top, but is if it was moved there.)
        return;
      }

      ContainerVisibility.hide(containerToHide);
    }
  }, {
    key: 'registerGadget',
    value: function registerGadget(gadget) {
      // Wrap the gadget so it has Atom-specific stuff.
      gadget = (0, _wrapGadget2['default'])(gadget);

      this._observer.onNext({
        type: ActionTypes.REGISTER_GADGET,
        payload: { gadget: gadget }
      });
    }

    /**
     * Make sure all of the pane items reflect the current state of the app.
     */
  }, {
    key: 'renderPaneItems',
    value: function renderPaneItems() {
      var _this = this;

      var state = this._getState();

      atom.workspace.getPanes().forEach(function (pane) {
        var items = pane.getItems();
        var activeItem = pane.getActiveItem();

        // Iterate in reverse so that we can't get tripped up by the items we're adding.
        for (var index = items.length - 1; index >= 0; index--) {
          var item = items[index];

          // If the item is a placeholder, try to replace it. If we were successful, then we know
          // the item is up-to-date, so there's no need to update it and we can move on to the
          // next item.
          if (_this.replacePlaceholder(item, pane, index) != null) {
            continue;
          }

          var GadgetComponent = state.get('components').get(item);

          // If there's no component for this item, it isn't a gadget.
          if (GadgetComponent == null) {
            continue;
          }

          // Update the props for the item.
          var oldProps = state.get('props').get(item);
          var newProps = _extends({}, oldProps, {
            active: item === activeItem
          });

          // Don't re-render if the props haven't changed.
          if ((0, _shallowequal2['default'])(oldProps, newProps)) {
            continue;
          }

          // Re-render the item with the new props.
          _reactForAtom.ReactDOM.render(_reactForAtom.React.createElement(GadgetComponent, newProps), item.element);

          _this._observer.onNext({
            type: ActionTypes.UPDATE_PANE_ITEM,
            payload: {
              item: item,
              props: newProps
            }
          });
        }
      });
    }

    /**
     * Replace the item if it is a placeholder, returning the new item.
     */
  }, {
    key: 'replacePlaceholder',
    value: function replacePlaceholder(item, pane, index) {
      if (!(item instanceof _GadgetPlaceholder2['default'])) {
        return null;
      }

      var gadgetId = item.getGadgetId();
      var gadget = this._getState().get('gadgets').get(gadgetId);

      if (gadget == null) {
        // Still don't have the gadget.
        return null;
      }

      // Now that we have the gadget, we can deserialize the state. **IMPORTANT:** if it
      // doesn't have any (e.g. it's `== null`) that's okay! It allows components to provide a
      // default initial state in their constructor; for example:
      //
      //     constructor(props) {
      //       super(props);
      //       this.state = props.initialState || {count: 1};
      //     }
      var rawInitialGadgetState = item.getRawInitialGadgetState();
      var initialState = typeof gadget.deserializeState === 'function' ? gadget.deserializeState(rawInitialGadgetState) : rawInitialGadgetState;

      var active = pane.getActiveItem() === item;
      var realItem = this.createPaneItem(gadgetId, { initialState: initialState, active: active }, false);

      if (realItem == null) {
        return;
      }

      // Copy the metadata about the container from the placeholder.
      // TODO(matthewwithanm): Decide how to assign `_expandedFlexScale` to `HTMLElement` to remove
      //   this `any` cast.
      realItem._expandedFlexScale = item._expandedFlexScale;

      // Replace the placeholder with the real item. We'll add the real item first and then
      // remove the old one so that we don't risk dropping down to zero items.
      pane.addItem(realItem, index + 1);
      pane.destroyItem(item);
      if (active) {
        pane.setActiveItem(realItem);
      }

      return realItem;
    }

    /**
     * Ensure that a gadget of the specified gadgetId is visible, creating one if necessary.
     */
  }, {
    key: 'showGadget',
    value: function showGadget(gadgetId) {
      var match = (0, _findPaneAndItem2['default'])(function (item) {
        return getGadgetId(item) === gadgetId;
      });

      if (match == null) {
        // If the gadget isn't in the workspace, create it.
        var newItem = this.createPaneItem(gadgetId);

        if (newItem == null) {
          return;
        }

        var gadget = this._getState().get('gadgets').get(gadgetId);
        var defaultLocation = gadget.defaultLocation || 'active-pane';
        var _pane = (0, _findOrCreatePaneItemLocation2['default'])(defaultLocation);
        _pane.addItem(newItem);
        _pane.activateItem(newItem);
        return newItem;
      }

      var item = match.item;
      var pane = match.pane;

      pane.activateItem(item);

      // If the item isn't in a hidable container (i.e. it's a top-level pane item), we're done.
      var hiddenContainer = (0, _getContainerToHide2['default'])(pane);
      if (hiddenContainer == null) {
        return item;
      }

      // Show all of the containers recursively up the tree.
      for (var container of (0, _getResizableContainers2['default'])(hiddenContainer)) {
        ContainerVisibility.show(container);
      }

      return item;
    }
  }, {
    key: 'toggleGadget',
    value: function toggleGadget(gadgetId) {
      // Show the gadget if it doesn't already exist in the workspace.
      var match = (0, _findPaneAndItem2['default'])(function (item) {
        return getGadgetId(item) === gadgetId;
      });
      if (match == null) {
        this.showGadget(gadgetId);
        return;
      }

      var pane = match.pane;

      // Show the gadget if it's hidden.
      for (var container of (0, _getResizableContainers2['default'])(pane)) {
        if (ContainerVisibility.isHidden(container)) {
          this.showGadget(gadgetId);
          return;
        }
      }

      this.hideGadget(gadgetId);
    }
  }, {
    key: 'unregisterGadget',
    value: function unregisterGadget(gadgetId) {
      this._observer.onNext({
        type: ActionTypes.UNREGISTER_GADGET,
        payload: { gadgetId: gadgetId }
      });
    }

    /**
     * Update the provided container's expanded flex scale to its current flex scale.
     */
  }, {
    key: 'updateExpandedFlexScale',
    value: function updateExpandedFlexScale(container) {
      var flexScale = container.getFlexScale();

      // If the flex scale is zero, the container isn't expanded.
      if (flexScale === 0) {
        return;
      }

      ExpandedFlexScale.set(container, flexScale);
    }
  }]);

  return Commands;
})();

exports['default'] = Commands;

function getGadgetId(item) {
  return item.getGadgetId ? item.getGadgetId() : item.constructor.gadgetId;
}
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,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Q1I7O1VBRU0sSUFBSSxHQUFJLEtBQUssQ0FBYixJQUFJOzs7QUFHWCxXQUFLLElBQU0sU0FBUyxJQUFJLHlDQUF1QixJQUFJLENBQUMsRUFBRTtBQUNwRCxZQUFJLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsRUFBRTtBQUMzQyxjQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzFCLGlCQUFPO1NBQ1I7T0FDRjs7QUFFRCxVQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQzNCOzs7V0FFZSwwQkFBQyxRQUFnQixFQUFRO0FBQ3ZDLFVBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDO0FBQ3BCLFlBQUksRUFBRSxXQUFXLENBQUMsaUJBQWlCO0FBQ25DLGVBQU8sRUFBRSxFQUFDLFFBQVEsRUFBUixRQUFRLEVBQUM7T0FDcEIsQ0FBQyxDQUFDO0tBQ0o7Ozs7Ozs7V0FLc0IsaUNBQUMsU0FBNEIsRUFBUTtBQUMxRCxVQUFNLFNBQVMsR0FBRyxTQUFTLENBQUMsWUFBWSxFQUFFLENBQUM7OztBQUczQyxVQUFJLFNBQVMsS0FBSyxDQUFDLEVBQUU7QUFDbkIsZUFBTztPQUNSOztBQUVELHVCQUFpQixDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7S0FDN0M7OztTQTdTa0IsUUFBUTs7O3FCQUFSLFFBQVE7O0FBaVQ3QixTQUFTLFdBQVcsQ0FBQyxJQUFJLEVBQUU7QUFDekIsU0FBTyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLEVBQUUsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQztDQUMxRSIsImZpbGUiOiJDb21tYW5kcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuLyogQGZsb3cgKi9cblxuLypcbiAqIENvcHlyaWdodCAoYykgMjAxNS1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBsaWNlbnNlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgaW5cbiAqIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbmltcG9ydCB0eXBlIHtHYWRnZXQsIEdhZGdldExvY2F0aW9ufSBmcm9tICcuLi8uLi9nYWRnZXRzLWludGVyZmFjZXMnO1xuaW1wb3J0IHR5cGUgSW1tdXRhYmxlIGZyb20gJ2ltbXV0YWJsZSc7XG5pbXBvcnQgdHlwZSB7UGFuZUl0ZW1Db250YWluZXJ9IGZyb20gJy4uL3R5cGVzL1BhbmVJdGVtQ29udGFpbmVyJztcblxuaW1wb3J0ICogYXMgQWN0aW9uVHlwZXMgZnJvbSAnLi9BY3Rpb25UeXBlcyc7XG5pbXBvcnQgKiBhcyBDb250YWluZXJWaXNpYmlsaXR5IGZyb20gJy4vQ29udGFpbmVyVmlzaWJpbGl0eSc7XG5pbXBvcnQgY3JlYXRlQ29tcG9uZW50SXRlbSBmcm9tICcuL2NyZWF0ZUNvbXBvbmVudEl0ZW0nO1xuaW1wb3J0ICogYXMgRXhwYW5kZWRGbGV4U2NhbGUgZnJvbSAnLi9FeHBhbmRlZEZsZXhTY2FsZSc7XG5pbXBvcnQgZmluZE9yQ3JlYXRlUGFuZUl0ZW1Mb2NhdGlvbiBmcm9tICcuL2ZpbmRPckNyZWF0ZVBhbmVJdGVtTG9jYXRpb24nO1xuaW1wb3J0IGZpbmRQYW5lQW5kSXRlbSBmcm9tICcuL2ZpbmRQYW5lQW5kSXRlbSc7XG5pbXBvcnQgZ2V0Q29udGFpbmVyVG9IaWRlIGZyb20gJy4vZ2V0Q29udGFpbmVyVG9IaWRlJztcbmltcG9ydCBnZXRSZXNpemFibGVDb250YWluZXJzIGZyb20gJy4vZ2V0UmVzaXphYmxlQ29udGFpbmVycyc7XG5pbXBvcnQgR2FkZ2V0UGxhY2Vob2xkZXIgZnJvbSAnLi9HYWRnZXRQbGFjZWhvbGRlcic7XG5pbXBvcnQge1xuICBSZWFjdCxcbiAgUmVhY3RET00sXG59IGZyb20gJ3JlYWN0LWZvci1hdG9tJztcbmltcG9ydCBzaGFsbG93RXF1YWwgZnJvbSAnc2hhbGxvd2VxdWFsJztcbmltcG9ydCB3cmFwR2FkZ2V0IGZyb20gJy4vd3JhcEdhZGdldCc7XG5cbi8qKlxuICogQ3JlYXRlIGFuIG9iamVjdCB0aGF0IHByb3ZpZGVzIGNvbW1hbmRzIChcImFjdGlvbiBjcmVhdG9yc1wiKVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb21tYW5kcyB7XG5cbiAgX29ic2VydmVyOiByeCRJT2JzZXJ2ZXI7XG4gIF9nZXRTdGF0ZTogKCkgPT4gSW1tdXRhYmxlLk1hcDtcblxuICBjb25zdHJ1Y3RvcihvYnNlcnZlcjogcngkSU9ic2VydmVyLCBnZXRTdGF0ZTogKCkgPT4gSW1tdXRhYmxlLk1hcCkge1xuICAgIHRoaXMuX29ic2VydmVyID0gb2JzZXJ2ZXI7XG4gICAgdGhpcy5fZ2V0U3RhdGUgPSBnZXRTdGF0ZTtcbiAgfVxuXG4gIGRlYWN0aXZhdGUoKTogdm9pZCB7XG4gICAgdGhpcy5fb2JzZXJ2ZXIub25OZXh0KHtcbiAgICAgIHR5cGU6IEFjdGlvblR5cGVzLkRFQUNUSVZBVEUsXG4gICAgfSk7XG4gICAgdGhpcy5fb2JzZXJ2ZXIub25Db21wbGV0ZWQoKTtcbiAgfVxuXG4gIGRlc3Ryb3lHYWRnZXQoZ2FkZ2V0SWQ6IHN0cmluZyk6IHZvaWQge1xuICAgIGNvbnN0IG1hdGNoID0gZmluZFBhbmVBbmRJdGVtKGl0ZW0gPT4gZ2V0R2FkZ2V0SWQoaXRlbSkgPT09IGdhZGdldElkKTtcbiAgICBpZiAobWF0Y2ggPT0gbnVsbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBtYXRjaC5wYW5lLmRlc3Ryb3lJdGVtKG1hdGNoLml0ZW0pO1xuICB9XG5cbiAgY2xlYW5VcERlc3Ryb3llZFBhbmVJdGVtKGl0ZW06IE9iamVjdCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5fZ2V0U3RhdGUoKS5nZXQoJ2NvbXBvbmVudHMnKS5oYXMoaXRlbSkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBSZWFjdERPTS51bm1vdW50Q29tcG9uZW50QXROb2RlKGl0ZW0uZWxlbWVudCk7XG5cbiAgICB0aGlzLl9vYnNlcnZlci5vbk5leHQoe1xuICAgICAgdHlwZTogQWN0aW9uVHlwZXMuREVTVFJPWV9QQU5FX0lURU0sXG4gICAgICBwYXlsb2FkOiB7aXRlbX0sXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBwYW5lIGl0ZW0gZm9yIHRoZSBzcGVjaWZpZWQgZ2FkZ2V0LiBUaGlzIGlzIG1lYW50IHRvIGJlIHRoZSBzaW5nbGUgcG9pbnRcbiAgICogdGhyb3VnaCB3aGljaCBhbGwgcGFuZSBpdGVtIGNyZWF0aW9uIGdvZXMgKG5ldyBwYW5lIGl0ZW0gY3JlYXRpb24sIGRlc2VyaWFsaXphdGlvbixcbiAgICogc3BsaXR0aW5nLCByZW9wZW5pbmcsIGV0Yy4pLlxuICAgKi9cbiAgY3JlYXRlUGFuZUl0ZW0oZ2FkZ2V0SWQ6IHN0cmluZywgcHJvcHM/OiBPYmplY3QsIGlzTmV3OiBib29sZWFuID0gdHJ1ZSk6ID9IVE1MRWxlbWVudCB7XG4gICAgLy8gTG9vayB1cCB0aGUgZ2FkZ2V0LlxuICAgIGNvbnN0IGdhZGdldCA9IHRoaXMuX2dldFN0YXRlKCkuZ2V0KCdnYWRnZXRzJykuZ2V0KGdhZGdldElkKTtcblxuICAgIC8vIElmIHRoZXJlJ3Mgbm8gZ2FkZ2V0IHJlZ2lzdGVyZWQgd2l0aCB0aGUgcHJvdmlkZWQgSUQsIGFib3J0LiBNYXliZSB0aGUgdXNlciBqdXN0XG4gICAgLy8gZGVhY3RpdmF0ZWQgdGhhdCBwYWNrYWdlLlxuICAgIGlmIChnYWRnZXQgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IEdhZGdldENvbXBvbmVudCA9IGdhZGdldDtcbiAgICBjb25zdCBpdGVtID0gY3JlYXRlQ29tcG9uZW50SXRlbSg8R2FkZ2V0Q29tcG9uZW50IHsuLi5wcm9wc30gLz4pO1xuXG4gICAgdGhpcy5fb2JzZXJ2ZXIub25OZXh0KHtcbiAgICAgIHR5cGU6IEFjdGlvblR5cGVzLkNSRUFURV9QQU5FX0lURU0sXG4gICAgICBwYXlsb2FkOiB7XG4gICAgICAgIGNvbXBvbmVudDogR2FkZ2V0Q29tcG9uZW50LFxuICAgICAgICBnYWRnZXRJZCxcbiAgICAgICAgaXRlbSxcbiAgICAgICAgcHJvcHMsXG4gICAgICAgIGlzTmV3LFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIHJldHVybiBpdGVtO1xuICB9XG5cbiAgaGlkZUdhZGdldChnYWRnZXRJZDogc3RyaW5nKTogdm9pZCB7XG4gICAgLy8gSGlkaW5nIGEgZ2FkZ2V0IGRvZXNuJ3QganVzdCBtZWFuIGNsb3NpbmcgaXRzIHBhbmU7IGl0IG1lYW5zIGdldHRpbmcgaXQgb3V0IG9mIHRoZSB3YXkuXG4gICAgLy8gSnVzdCBjbG9zaW5nIGl0cyBwYW5lIGFuZCB3b3VsZCBwb3RlbnRpYWxseSBsZWF2ZSBzaWJsaW5ncyB3aGljaCwgcHJlc3VtYWJseSwgdGhlIHVzZXJcbiAgICAvLyB3b3VsZCB0aGVuIGhhdmUgdG8gYWxzbyBjbG9zZS4gSW5zdGVhZCwgaXQncyBtb3JlIHVzZWZ1bCB0byBpZGVudGlmeSB0aGUgZ3JvdXAgb2YgZ2FkZ2V0c1xuICAgIC8vIHRvIHdoaWNoIHRoaXMgb25lIGJlbG9uZ3MgYW5kIGdldCBpdCBvdXQgb2YgdGhlIHdheS4gVGhvdWdoIGdyb3VwcyBjYW4gYmUgbmVzdGVkLCB0aGUgbW9zdFxuICAgIC8vIHVzZWZ1bCB0byBoaWRlIGlzIGFsbW9zdCBjZXJ0YWlubHkgdGhlIHRvcG1vc3QsIHNvIHRoYXQncyB3aGF0IHdlIGRvLlxuXG4gICAgY29uc3QgbWF0Y2ggPSBmaW5kUGFuZUFuZEl0ZW0oaXRlbSA9PiBnZXRHYWRnZXRJZChpdGVtKSA9PT0gZ2FkZ2V0SWQpO1xuXG4gICAgLy8gSWYgdGhlIGdhZGdldCBpc24ndCBwcmVzZW50LCBubyBiaWdnaWU7IGp1c3Qgbm8tb3AuXG4gICAgaWYgKG1hdGNoID09IG51bGwpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB7aXRlbTogZ2FkZ2V0SXRlbSwgcGFuZTogcGFyZW50UGFuZX0gPSBtYXRjaDtcbiAgICBjb25zdCBjb250YWluZXJUb0hpZGUgPSBnZXRDb250YWluZXJUb0hpZGUocGFyZW50UGFuZSk7XG5cbiAgICAvLyBJZiBnYWRnZXQgaXMgYXQgdGhlIHRvcCBsZXZlbCBcImhpZGluZ1wiIGlzIGtpbmQgb2YgYSBtdXJreSBjb25jZXB0IGJ1dCB3ZSdsbCB0YWtlIGl0IHRvIG1lYW5cbiAgICAvLyBcImNsb3NlLlwiXG4gICAgaWYgKGNvbnRhaW5lclRvSGlkZSA9PSBudWxsKSB7XG4gICAgICBwYXJlbnRQYW5lLmRlc3Ryb3lJdGVtKGdhZGdldEl0ZW0pO1xuXG4gICAgICAvLyBUT0RPOiBTdG9yZSB0aGUgbG9jYXRpb24gb2YgdGhlIGNsb3NlZCBwYW5lIGZvciBzZXJpYWxpemF0aW9uIHNvIHdlIGNhbiByZW9wZW4gdGhpc1xuICAgICAgLy8gICAgICAgZ2FkZ2V0IHRoZXJlIG5leHQgdGltZS4gKFRoaXMgaXNuJ3QgbmVjZXNzYXJ5IGlmIHRoZSBnYWRnZXQncyBkZWZhdWx0IGxvY2F0aW9uIGlzXG4gICAgICAvLyAgICAgICBhdCB0aGUgdG9wLCBidXQgaXMgaWYgaXQgd2FzIG1vdmVkIHRoZXJlLilcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBDb250YWluZXJWaXNpYmlsaXR5LmhpZGUoY29udGFpbmVyVG9IaWRlKTtcbiAgfVxuXG4gIHJlZ2lzdGVyR2FkZ2V0KGdhZGdldDogR2FkZ2V0KTogdm9pZCB7XG4gICAgLy8gV3JhcCB0aGUgZ2FkZ2V0IHNvIGl0IGhhcyBBdG9tLXNwZWNpZmljIHN0dWZmLlxuICAgIGdhZGdldCA9IHdyYXBHYWRnZXQoZ2FkZ2V0KTtcblxuICAgIHRoaXMuX29ic2VydmVyLm9uTmV4dCh7XG4gICAgICB0eXBlOiBBY3Rpb25UeXBlcy5SRUdJU1RFUl9HQURHRVQsXG4gICAgICBwYXlsb2FkOiB7Z2FkZ2V0fSxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYWtlIHN1cmUgYWxsIG9mIHRoZSBwYW5lIGl0ZW1zIHJlZmxlY3QgdGhlIGN1cnJlbnQgc3RhdGUgb2YgdGhlIGFwcC5cbiAgICovXG4gIHJlbmRlclBhbmVJdGVtcygpOiB2b2lkIHtcbiAgICBjb25zdCBzdGF0ZSA9IHRoaXMuX2dldFN0YXRlKCk7XG5cbiAgICBhdG9tLndvcmtzcGFjZS5nZXRQYW5lcygpXG4gICAgICAuZm9yRWFjaChwYW5lID0+IHtcbiAgICAgICAgY29uc3QgaXRlbXMgPSBwYW5lLmdldEl0ZW1zKCk7XG4gICAgICAgIGNvbnN0IGFjdGl2ZUl0ZW0gPSBwYW5lLmdldEFjdGl2ZUl0ZW0oKTtcblxuICAgICAgICAvLyBJdGVyYXRlIGluIHJldmVyc2Ugc28gdGhhdCB3ZSBjYW4ndCBnZXQgdHJpcHBlZCB1cCBieSB0aGUgaXRlbXMgd2UncmUgYWRkaW5nLlxuICAgICAgICBmb3IgKGxldCBpbmRleCA9IGl0ZW1zLmxlbmd0aCAtIDE7IGluZGV4ID49IDA7IGluZGV4LS0pIHtcbiAgICAgICAgICBjb25zdCBpdGVtID0gaXRlbXNbaW5kZXhdO1xuXG4gICAgICAgICAgLy8gSWYgdGhlIGl0ZW0gaXMgYSBwbGFjZWhvbGRlciwgdHJ5IHRvIHJlcGxhY2UgaXQuIElmIHdlIHdlcmUgc3VjY2Vzc2Z1bCwgdGhlbiB3ZSBrbm93XG4gICAgICAgICAgLy8gdGhlIGl0ZW0gaXMgdXAtdG8tZGF0ZSwgc28gdGhlcmUncyBubyBuZWVkIHRvIHVwZGF0ZSBpdCBhbmQgd2UgY2FuIG1vdmUgb24gdG8gdGhlXG4gICAgICAgICAgLy8gbmV4dCBpdGVtLlxuICAgICAgICAgIGlmICh0aGlzLnJlcGxhY2VQbGFjZWhvbGRlcihpdGVtLCBwYW5lLCBpbmRleCkgIT0gbnVsbCkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29uc3QgR2FkZ2V0Q29tcG9uZW50ID0gc3RhdGUuZ2V0KCdjb21wb25lbnRzJykuZ2V0KGl0ZW0pO1xuXG4gICAgICAgICAgLy8gSWYgdGhlcmUncyBubyBjb21wb25lbnQgZm9yIHRoaXMgaXRlbSwgaXQgaXNuJ3QgYSBnYWRnZXQuXG4gICAgICAgICAgaWYgKEdhZGdldENvbXBvbmVudCA9PSBudWxsKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBVcGRhdGUgdGhlIHByb3BzIGZvciB0aGUgaXRlbS5cbiAgICAgICAgICBjb25zdCBvbGRQcm9wcyA9IHN0YXRlLmdldCgncHJvcHMnKS5nZXQoaXRlbSk7XG4gICAgICAgICAgY29uc3QgbmV3UHJvcHMgPSB7XG4gICAgICAgICAgICAuLi5vbGRQcm9wcyxcbiAgICAgICAgICAgIGFjdGl2ZTogaXRlbSA9PT0gYWN0aXZlSXRlbSxcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgLy8gRG9uJ3QgcmUtcmVuZGVyIGlmIHRoZSBwcm9wcyBoYXZlbid0IGNoYW5nZWQuXG4gICAgICAgICAgaWYgKHNoYWxsb3dFcXVhbChvbGRQcm9wcywgbmV3UHJvcHMpKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBSZS1yZW5kZXIgdGhlIGl0ZW0gd2l0aCB0aGUgbmV3IHByb3BzLlxuICAgICAgICAgIFJlYWN0RE9NLnJlbmRlcihcbiAgICAgICAgICAgIDxHYWRnZXRDb21wb25lbnQgey4uLm5ld1Byb3BzfSAvPixcbiAgICAgICAgICAgIGl0ZW0uZWxlbWVudCxcbiAgICAgICAgICApO1xuXG4gICAgICAgICAgdGhpcy5fb2JzZXJ2ZXIub25OZXh0KHtcbiAgICAgICAgICAgIHR5cGU6IEFjdGlvblR5cGVzLlVQREFURV9QQU5FX0lURU0sXG4gICAgICAgICAgICBwYXlsb2FkOiB7XG4gICAgICAgICAgICAgIGl0ZW0sXG4gICAgICAgICAgICAgIHByb3BzOiBuZXdQcm9wcyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcGxhY2UgdGhlIGl0ZW0gaWYgaXQgaXMgYSBwbGFjZWhvbGRlciwgcmV0dXJuaW5nIHRoZSBuZXcgaXRlbS5cbiAgICovXG4gIHJlcGxhY2VQbGFjZWhvbGRlcihpdGVtOiBPYmplY3QsIHBhbmU6IGF0b20kUGFuZSwgaW5kZXg6IG51bWJlcik6ID9PYmplY3Qge1xuICAgIGlmICghKGl0ZW0gaW5zdGFuY2VvZiBHYWRnZXRQbGFjZWhvbGRlcikpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGdhZGdldElkID0gaXRlbS5nZXRHYWRnZXRJZCgpO1xuICAgIGNvbnN0IGdhZGdldCA9IHRoaXMuX2dldFN0YXRlKCkuZ2V0KCdnYWRnZXRzJykuZ2V0KGdhZGdldElkKTtcblxuICAgIGlmIChnYWRnZXQgPT0gbnVsbCkge1xuICAgICAgLy8gU3RpbGwgZG9uJ3QgaGF2ZSB0aGUgZ2FkZ2V0LlxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLy8gTm93IHRoYXQgd2UgaGF2ZSB0aGUgZ2FkZ2V0LCB3ZSBjYW4gZGVzZXJpYWxpemUgdGhlIHN0YXRlLiAqKklNUE9SVEFOVDoqKiBpZiBpdFxuICAgIC8vIGRvZXNuJ3QgaGF2ZSBhbnkgKGUuZy4gaXQncyBgPT0gbnVsbGApIHRoYXQncyBva2F5ISBJdCBhbGxvd3MgY29tcG9uZW50cyB0byBwcm92aWRlIGFcbiAgICAvLyBkZWZhdWx0IGluaXRpYWwgc3RhdGUgaW4gdGhlaXIgY29uc3RydWN0b3I7IGZvciBleGFtcGxlOlxuICAgIC8vXG4gICAgLy8gICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgLy8gICAgICAgc3VwZXIocHJvcHMpO1xuICAgIC8vICAgICAgIHRoaXMuc3RhdGUgPSBwcm9wcy5pbml0aWFsU3RhdGUgfHwge2NvdW50OiAxfTtcbiAgICAvLyAgICAgfVxuICAgIGNvbnN0IHJhd0luaXRpYWxHYWRnZXRTdGF0ZSA9IGl0ZW0uZ2V0UmF3SW5pdGlhbEdhZGdldFN0YXRlKCk7XG4gICAgY29uc3QgaW5pdGlhbFN0YXRlID0gKFxuICAgICAgdHlwZW9mIGdhZGdldC5kZXNlcmlhbGl6ZVN0YXRlID09PSAnZnVuY3Rpb24nID9cbiAgICAgICAgZ2FkZ2V0LmRlc2VyaWFsaXplU3RhdGUocmF3SW5pdGlhbEdhZGdldFN0YXRlKSA6IHJhd0luaXRpYWxHYWRnZXRTdGF0ZVxuICAgICk7XG5cbiAgICBjb25zdCBhY3RpdmUgPSBwYW5lLmdldEFjdGl2ZUl0ZW0oKSA9PT0gaXRlbTtcbiAgICBjb25zdCByZWFsSXRlbSA9IHRoaXMuY3JlYXRlUGFuZUl0ZW0oZ2FkZ2V0SWQsIHtpbml0aWFsU3RhdGUsIGFjdGl2ZX0sIGZhbHNlKTtcblxuICAgIGlmIChyZWFsSXRlbSA9PSBudWxsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gQ29weSB0aGUgbWV0YWRhdGEgYWJvdXQgdGhlIGNvbnRhaW5lciBmcm9tIHRoZSBwbGFjZWhvbGRlci5cbiAgICAvLyBUT0RPKG1hdHRoZXd3aXRoYW5tKTogRGVjaWRlIGhvdyB0byBhc3NpZ24gYF9leHBhbmRlZEZsZXhTY2FsZWAgdG8gYEhUTUxFbGVtZW50YCB0byByZW1vdmVcbiAgICAvLyAgIHRoaXMgYGFueWAgY2FzdC5cbiAgICAocmVhbEl0ZW06IGFueSkuX2V4cGFuZGVkRmxleFNjYWxlID0gaXRlbS5fZXhwYW5kZWRGbGV4U2NhbGU7XG5cbiAgICAvLyBSZXBsYWNlIHRoZSBwbGFjZWhvbGRlciB3aXRoIHRoZSByZWFsIGl0ZW0uIFdlJ2xsIGFkZCB0aGUgcmVhbCBpdGVtIGZpcnN0IGFuZCB0aGVuXG4gICAgLy8gcmVtb3ZlIHRoZSBvbGQgb25lIHNvIHRoYXQgd2UgZG9uJ3QgcmlzayBkcm9wcGluZyBkb3duIHRvIHplcm8gaXRlbXMuXG4gICAgcGFuZS5hZGRJdGVtKHJlYWxJdGVtLCBpbmRleCArIDEpO1xuICAgIHBhbmUuZGVzdHJveUl0ZW0oaXRlbSk7XG4gICAgaWYgKGFjdGl2ZSkge1xuICAgICAgcGFuZS5zZXRBY3RpdmVJdGVtKHJlYWxJdGVtKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVhbEl0ZW07XG4gIH1cblxuICAvKipcbiAgICogRW5zdXJlIHRoYXQgYSBnYWRnZXQgb2YgdGhlIHNwZWNpZmllZCBnYWRnZXRJZCBpcyB2aXNpYmxlLCBjcmVhdGluZyBvbmUgaWYgbmVjZXNzYXJ5LlxuICAgKi9cbiAgc2hvd0dhZGdldChnYWRnZXRJZDogc3RyaW5nKTogP09iamVjdCB7XG4gICAgY29uc3QgbWF0Y2ggPSBmaW5kUGFuZUFuZEl0ZW0oaXRlbSA9PiBnZXRHYWRnZXRJZChpdGVtKSA9PT0gZ2FkZ2V0SWQpO1xuXG4gICAgaWYgKG1hdGNoID09IG51bGwpIHtcbiAgICAgIC8vIElmIHRoZSBnYWRnZXQgaXNuJ3QgaW4gdGhlIHdvcmtzcGFjZSwgY3JlYXRlIGl0LlxuICAgICAgY29uc3QgbmV3SXRlbSA9IHRoaXMuY3JlYXRlUGFuZUl0ZW0oZ2FkZ2V0SWQpO1xuXG4gICAgICBpZiAobmV3SXRlbSA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZ2FkZ2V0ID0gdGhpcy5fZ2V0U3RhdGUoKS5nZXQoJ2dhZGdldHMnKS5nZXQoZ2FkZ2V0SWQpO1xuICAgICAgY29uc3QgZGVmYXVsdExvY2F0aW9uOiBHYWRnZXRMb2NhdGlvbiA9IGdhZGdldC5kZWZhdWx0TG9jYXRpb24gfHwgJ2FjdGl2ZS1wYW5lJztcbiAgICAgIGNvbnN0IHBhbmUgPSBmaW5kT3JDcmVhdGVQYW5lSXRlbUxvY2F0aW9uKGRlZmF1bHRMb2NhdGlvbik7XG4gICAgICBwYW5lLmFkZEl0ZW0obmV3SXRlbSk7XG4gICAgICBwYW5lLmFjdGl2YXRlSXRlbShuZXdJdGVtKTtcbiAgICAgIHJldHVybiBuZXdJdGVtO1xuICAgIH1cblxuICAgIGNvbnN0IHtpdGVtLCBwYW5lfSA9IG1hdGNoO1xuICAgIHBhbmUuYWN0aXZhdGVJdGVtKGl0ZW0pO1xuXG4gICAgLy8gSWYgdGhlIGl0ZW0gaXNuJ3QgaW4gYSBoaWRhYmxlIGNvbnRhaW5lciAoaS5lLiBpdCdzIGEgdG9wLWxldmVsIHBhbmUgaXRlbSksIHdlJ3JlIGRvbmUuXG4gICAgY29uc3QgaGlkZGVuQ29udGFpbmVyID0gZ2V0Q29udGFpbmVyVG9IaWRlKHBhbmUpO1xuICAgIGlmIChoaWRkZW5Db250YWluZXIgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGl0ZW07XG4gICAgfVxuXG4gICAgLy8gU2hvdyBhbGwgb2YgdGhlIGNvbnRhaW5lcnMgcmVjdXJzaXZlbHkgdXAgdGhlIHRyZWUuXG4gICAgZm9yIChjb25zdCBjb250YWluZXIgb2YgZ2V0UmVzaXphYmxlQ29udGFpbmVycyhoaWRkZW5Db250YWluZXIpKSB7XG4gICAgICBDb250YWluZXJWaXNpYmlsaXR5LnNob3coY29udGFpbmVyKTtcbiAgICB9XG5cbiAgICByZXR1cm4gaXRlbTtcbiAgfVxuXG4gIHRvZ2dsZUdhZGdldChnYWRnZXRJZDogc3RyaW5nKTogdm9pZCB7XG4gICAgLy8gU2hvdyB0aGUgZ2FkZ2V0IGlmIGl0IGRvZXNuJ3QgYWxyZWFkeSBleGlzdCBpbiB0aGUgd29ya3NwYWNlLlxuICAgIGNvbnN0IG1hdGNoID0gZmluZFBhbmVBbmRJdGVtKGl0ZW0gPT4gZ2V0R2FkZ2V0SWQoaXRlbSkgPT09IGdhZGdldElkKTtcbiAgICBpZiAobWF0Y2ggPT0gbnVsbCkge1xuICAgICAgdGhpcy5zaG93R2FkZ2V0KGdhZGdldElkKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB7cGFuZX0gPSBtYXRjaDtcblxuICAgIC8vIFNob3cgdGhlIGdhZGdldCBpZiBpdCdzIGhpZGRlbi5cbiAgICBmb3IgKGNvbnN0IGNvbnRhaW5lciBvZiBnZXRSZXNpemFibGVDb250YWluZXJzKHBhbmUpKSB7XG4gICAgICBpZiAoQ29udGFpbmVyVmlzaWJpbGl0eS5pc0hpZGRlbihjb250YWluZXIpKSB7XG4gICAgICAgIHRoaXMuc2hvd0dhZGdldChnYWRnZXRJZCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmhpZGVHYWRnZXQoZ2FkZ2V0SWQpO1xuICB9XG5cbiAgdW5yZWdpc3RlckdhZGdldChnYWRnZXRJZDogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5fb2JzZXJ2ZXIub25OZXh0KHtcbiAgICAgIHR5cGU6IEFjdGlvblR5cGVzLlVOUkVHSVNURVJfR0FER0VULFxuICAgICAgcGF5bG9hZDoge2dhZGdldElkfSxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGUgdGhlIHByb3ZpZGVkIGNvbnRhaW5lcidzIGV4cGFuZGVkIGZsZXggc2NhbGUgdG8gaXRzIGN1cnJlbnQgZmxleCBzY2FsZS5cbiAgICovXG4gIHVwZGF0ZUV4cGFuZGVkRmxleFNjYWxlKGNvbnRhaW5lcjogUGFuZUl0ZW1Db250YWluZXIpOiB2b2lkIHtcbiAgICBjb25zdCBmbGV4U2NhbGUgPSBjb250YWluZXIuZ2V0RmxleFNjYWxlKCk7XG5cbiAgICAvLyBJZiB0aGUgZmxleCBzY2FsZSBpcyB6ZXJvLCB0aGUgY29udGFpbmVyIGlzbid0IGV4cGFuZGVkLlxuICAgIGlmIChmbGV4U2NhbGUgPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBFeHBhbmRlZEZsZXhTY2FsZS5zZXQoY29udGFpbmVyLCBmbGV4U2NhbGUpO1xuICB9XG5cbn1cblxuZnVuY3Rpb24gZ2V0R2FkZ2V0SWQoaXRlbSkge1xuICByZXR1cm4gaXRlbS5nZXRHYWRnZXRJZCA/IGl0ZW0uZ2V0R2FkZ2V0SWQoKSA6IGl0ZW0uY29uc3RydWN0b3IuZ2FkZ2V0SWQ7XG59XG4iXX0=