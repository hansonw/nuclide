var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

var _require = require('atom');

var Disposable = _require.Disposable;

var _require2 = require('events');

var EventEmitter = _require2.EventEmitter;

var Constants = require('./Constants');

/**
 * Flux style Store holding all data used by the debugger plugin.
 */

var DebuggerStore = (function () {
  function DebuggerStore(dispatcher) {
    _classCallCheck(this, DebuggerStore);

    this._dispatcher = dispatcher;
    this._eventEmitter = new EventEmitter();
    this._dispatcherToken = this._dispatcher.register(this._handlePayload.bind(this));

    this._debuggerProcess = null;
    this._error = null;
    this._services = new Set();
    this._processSocket = null;
    this._debuggerMode = 'stopped';
  }

  _createClass(DebuggerStore, [{
    key: 'dispose',
    value: function dispose() {
      this._eventEmitter.removeAllListeners();
      this._dispatcher.unregister(this._dispatcherToken);
      if (this._debuggerProcess) {
        this._debuggerProcess.dispose();
      }
    }
  }, {
    key: 'getDebuggerProcess',
    value: function getDebuggerProcess() {
      return this._debuggerProcess;
    }
  }, {
    key: 'getError',
    value: function getError() {
      return this._error;
    }

    /**
     * Return attachables.
     *
     * @param optional service name (e.g. lldb) to filter resulting attachables.
     */
  }, {
    key: 'getProcessInfoList',
    value: function getProcessInfoList(serviceName) {
      return Promise.all(require('../../../commons').array.from(this._services).map(function (service) {
        if (!serviceName || service.name === serviceName) {
          return service.getProcessInfoList();
        } else {
          return Promise.resolve([]);
        }
      })).then(function (values) {
        return [].concat.apply([], values);
      });
    }
  }, {
    key: 'getProcessSocket',
    value: function getProcessSocket() {
      return this._processSocket;
    }
  }, {
    key: 'getDebuggerMode',
    value: function getDebuggerMode() {
      return this._debuggerMode;
    }
  }, {
    key: 'onChange',
    value: function onChange(callback) {
      var emitter = this._eventEmitter;
      this._eventEmitter.on('change', callback);
      return new Disposable(function () {
        return emitter.removeListener('change', callback);
      });
    }
  }, {
    key: '_handlePayload',
    value: function _handlePayload(payload) {
      switch (payload.actionType) {
        case Constants.Actions.SET_PROCESS_SOCKET:
          this._processSocket = payload.data;
          break;
        case Constants.Actions.ADD_SERVICE:
          if (this._services.has(payload.data)) {
            return;
          }
          this._services.add(payload.data);
          break;
        case Constants.Actions.REMOVE_SERVICE:
          if (!this._services.has(payload.data)) {
            return;
          }
          this._services['delete'](payload.data);
          break;
        case Constants.Actions.SET_ERROR:
          this._error = payload.data;
          break;
        case Constants.Actions.SET_DEBUGGER_PROCESS:
          this._debuggerProcess = payload.data;
          break;
        case Constants.Actions.DEBUGGER_MODE_CHANGE:
          this._debuggerMode = payload.data;
          break;
        default:
          return;
      }
      this._eventEmitter.emit('change');
    }
  }]);

  return DebuggerStore;
})();

module.exports = DebuggerStore;

// Stored values
//# sourceMappingURL=data:application/json;base64,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QUFPLEdBQUcsYUFBYSxDQUFDIiwiZmlsZSI6IkRlYnVnZ2VyU3RvcmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcbi8qIEBmbG93ICovXG5cbi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTUtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgbGljZW5zZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGluXG4gKiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG5jb25zdCB7RGlzcG9zYWJsZX0gPSByZXF1aXJlKCdhdG9tJyk7XG5jb25zdCB7RXZlbnRFbWl0dGVyfSA9IHJlcXVpcmUoJ2V2ZW50cycpO1xuY29uc3QgQ29uc3RhbnRzID0gcmVxdWlyZSgnLi9Db25zdGFudHMnKTtcblxuaW1wb3J0IHR5cGUge0Rpc3BhdGNoZXJ9IGZyb20gJ2ZsdXgnO1xuaW1wb3J0IHR5cGUge251Y2xpZGVfZGVidWdnZXIkU2VydmljZX0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlcy9zZXJ2aWNlJztcbmltcG9ydCB0eXBlIERlYnVnZ2VySW5zdGFuY2UgZnJvbSAnLi9EZWJ1Z2dlckluc3RhbmNlJztcbmltcG9ydCB0eXBlIERlYnVnZ2VyUHJvY2Vzc0luZm9UeXBlIGZyb20gJy4vRGVidWdnZXJQcm9jZXNzSW5mbyc7XG5cbnR5cGUgRGVidWdnZXJNb2RlID0gJ3N0YXJ0aW5nJyB8ICdkZWJ1Z2dpbmcnIHwgJ3N0b3BwZWQnO1xuXG4vKipcbiAqIEZsdXggc3R5bGUgU3RvcmUgaG9sZGluZyBhbGwgZGF0YSB1c2VkIGJ5IHRoZSBkZWJ1Z2dlciBwbHVnaW4uXG4gKi9cbmNsYXNzIERlYnVnZ2VyU3RvcmUge1xuICBfZGlzcGF0Y2hlcjogRGlzcGF0Y2hlcjtcbiAgX2V2ZW50RW1pdHRlcjogRXZlbnRFbWl0dGVyO1xuICBfZGlzcGF0Y2hlclRva2VuOiBhbnk7XG5cbiAgLy8gU3RvcmVkIHZhbHVlc1xuICBfZGVidWdnZXJQcm9jZXNzOiA/RGVidWdnZXJJbnN0YW5jZTtcbiAgX2Vycm9yOiA/c3RyaW5nO1xuICBfc2VydmljZXM6IFNldDxudWNsaWRlX2RlYnVnZ2VyJFNlcnZpY2U+O1xuICBfcHJvY2Vzc1NvY2tldDogP3N0cmluZztcbiAgX2RlYnVnZ2VyTW9kZTogRGVidWdnZXJNb2RlO1xuXG4gIGNvbnN0cnVjdG9yKGRpc3BhdGNoZXI6IERpc3BhdGNoZXIpIHtcbiAgICB0aGlzLl9kaXNwYXRjaGVyID0gZGlzcGF0Y2hlcjtcbiAgICB0aGlzLl9ldmVudEVtaXR0ZXIgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gICAgdGhpcy5fZGlzcGF0Y2hlclRva2VuID0gdGhpcy5fZGlzcGF0Y2hlci5yZWdpc3Rlcih0aGlzLl9oYW5kbGVQYXlsb2FkLmJpbmQodGhpcykpO1xuXG4gICAgdGhpcy5fZGVidWdnZXJQcm9jZXNzID0gbnVsbDtcbiAgICB0aGlzLl9lcnJvciA9IG51bGw7XG4gICAgdGhpcy5fc2VydmljZXMgPSBuZXcgU2V0KCk7XG4gICAgdGhpcy5fcHJvY2Vzc1NvY2tldCA9IG51bGw7XG4gICAgdGhpcy5fZGVidWdnZXJNb2RlID0gJ3N0b3BwZWQnO1xuICB9XG5cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLl9ldmVudEVtaXR0ZXIucmVtb3ZlQWxsTGlzdGVuZXJzKCk7XG4gICAgdGhpcy5fZGlzcGF0Y2hlci51bnJlZ2lzdGVyKHRoaXMuX2Rpc3BhdGNoZXJUb2tlbik7XG4gICAgaWYgKHRoaXMuX2RlYnVnZ2VyUHJvY2Vzcykge1xuICAgICAgdGhpcy5fZGVidWdnZXJQcm9jZXNzLmRpc3Bvc2UoKTtcbiAgICB9XG4gIH1cblxuICBnZXREZWJ1Z2dlclByb2Nlc3MoKTogP0RlYnVnZ2VySW5zdGFuY2Uge1xuICAgIHJldHVybiB0aGlzLl9kZWJ1Z2dlclByb2Nlc3M7XG4gIH1cblxuICBnZXRFcnJvcigpOiA/c3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fZXJyb3I7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIGF0dGFjaGFibGVzLlxuICAgKlxuICAgKiBAcGFyYW0gb3B0aW9uYWwgc2VydmljZSBuYW1lIChlLmcuIGxsZGIpIHRvIGZpbHRlciByZXN1bHRpbmcgYXR0YWNoYWJsZXMuXG4gICAqL1xuICBnZXRQcm9jZXNzSW5mb0xpc3Qoc2VydmljZU5hbWU/OiBzdHJpbmcpOiBQcm9taXNlPEFycmF5PERlYnVnZ2VyUHJvY2Vzc0luZm9UeXBlPj4ge1xuICAgIHJldHVybiBQcm9taXNlLmFsbChcbiAgICAgICAgcmVxdWlyZSgnLi4vLi4vLi4vY29tbW9ucycpLmFycmF5LmZyb20odGhpcy5fc2VydmljZXMpXG4gICAgICAgICAgLm1hcChzZXJ2aWNlID0+IHtcbiAgICAgICAgICAgIGlmICghc2VydmljZU5hbWUgfHwgc2VydmljZS5uYW1lID09PSBzZXJ2aWNlTmFtZSkge1xuICAgICAgICAgICAgICByZXR1cm4gc2VydmljZS5nZXRQcm9jZXNzSW5mb0xpc3QoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoW10pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pKVxuICAgICAgICAudGhlbih2YWx1ZXMgPT4gW10uY29uY2F0LmFwcGx5KFtdLCB2YWx1ZXMpKTtcbiAgfVxuXG4gIGdldFByb2Nlc3NTb2NrZXQoKTogP3N0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX3Byb2Nlc3NTb2NrZXQ7XG4gIH1cblxuICBnZXREZWJ1Z2dlck1vZGUoKTogRGVidWdnZXJNb2RlIHtcbiAgICByZXR1cm4gdGhpcy5fZGVidWdnZXJNb2RlO1xuICB9XG5cbiAgb25DaGFuZ2UoY2FsbGJhY2s6ICgpID0+IHZvaWQpOiBEaXNwb3NhYmxlIHtcbiAgICBjb25zdCBlbWl0dGVyID0gdGhpcy5fZXZlbnRFbWl0dGVyO1xuICAgIHRoaXMuX2V2ZW50RW1pdHRlci5vbignY2hhbmdlJywgY2FsbGJhY2spO1xuICAgIHJldHVybiBuZXcgRGlzcG9zYWJsZSgoKSA9PiBlbWl0dGVyLnJlbW92ZUxpc3RlbmVyKCdjaGFuZ2UnLCBjYWxsYmFjaykpO1xuICB9XG5cbiAgX2hhbmRsZVBheWxvYWQocGF5bG9hZDogT2JqZWN0KSB7XG4gICAgc3dpdGNoIChwYXlsb2FkLmFjdGlvblR5cGUpIHtcbiAgICAgIGNhc2UgQ29uc3RhbnRzLkFjdGlvbnMuU0VUX1BST0NFU1NfU09DS0VUOlxuICAgICAgICB0aGlzLl9wcm9jZXNzU29ja2V0ID0gcGF5bG9hZC5kYXRhO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgQ29uc3RhbnRzLkFjdGlvbnMuQUREX1NFUlZJQ0U6XG4gICAgICAgIGlmICh0aGlzLl9zZXJ2aWNlcy5oYXMocGF5bG9hZC5kYXRhKSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9zZXJ2aWNlcy5hZGQocGF5bG9hZC5kYXRhKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIENvbnN0YW50cy5BY3Rpb25zLlJFTU9WRV9TRVJWSUNFOlxuICAgICAgICBpZiAoIXRoaXMuX3NlcnZpY2VzLmhhcyhwYXlsb2FkLmRhdGEpKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3NlcnZpY2VzLmRlbGV0ZShwYXlsb2FkLmRhdGEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgQ29uc3RhbnRzLkFjdGlvbnMuU0VUX0VSUk9SOlxuICAgICAgICB0aGlzLl9lcnJvciA9IHBheWxvYWQuZGF0YTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIENvbnN0YW50cy5BY3Rpb25zLlNFVF9ERUJVR0dFUl9QUk9DRVNTOlxuICAgICAgICB0aGlzLl9kZWJ1Z2dlclByb2Nlc3MgPSBwYXlsb2FkLmRhdGE7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBDb25zdGFudHMuQWN0aW9ucy5ERUJVR0dFUl9NT0RFX0NIQU5HRTpcbiAgICAgICAgdGhpcy5fZGVidWdnZXJNb2RlID0gcGF5bG9hZC5kYXRhO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5fZXZlbnRFbWl0dGVyLmVtaXQoJ2NoYW5nZScpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gRGVidWdnZXJTdG9yZTtcbiJdfQ==