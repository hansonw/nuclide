function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

// TODO: Remove this once all services have been moved to framework v3.

var _remoteConnection = require('../../remote-connection');

module.exports = {
  getFileForPath: _remoteConnection.getFileForPath,
  getService: _remoteConnection.getService,
  getServiceLogger: _remoteConnection.getServiceLogger,
  getServiceByNuclideUri: _remoteConnection.getServiceByNuclideUri,

  getFileSystemServiceByNuclideUri: function getFileSystemServiceByNuclideUri(uri) {
    var service = (0, _remoteConnection.getServiceByNuclideUri)('FileSystemService', uri);
    (0, _assert2['default'])(service);
    return service;
  }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztzQkFhc0IsUUFBUTs7Ozs7O2dDQVF2Qix5QkFBeUI7O0FBRWhDLE1BQU0sQ0FBQyxPQUFPLEdBQUc7QUFDZixnQkFBYyxrQ0FBQTtBQUNkLFlBQVUsOEJBQUE7QUFDVixrQkFBZ0Isb0NBQUE7QUFDaEIsd0JBQXNCLDBDQUFBOztBQUV0QixrQ0FBZ0MsRUFBQSwwQ0FBQyxHQUFlLEVBQXFCO0FBQ25FLFFBQU0sT0FBTyxHQUFHLDhDQUF1QixtQkFBbUIsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUNqRSw2QkFBVSxPQUFPLENBQUMsQ0FBQztBQUNuQixXQUFPLE9BQU8sQ0FBQztHQUNoQjtDQUNGLENBQUMiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuLyogQGZsb3cgKi9cblxuLypcbiAqIENvcHlyaWdodCAoYykgMjAxNS1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBsaWNlbnNlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgaW5cbiAqIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbmltcG9ydCB0eXBlIHtOdWNsaWRlVXJpfSBmcm9tICcuLi8uLi9yZW1vdGUtdXJpJztcbmltcG9ydCB0eXBlIHtGaWxlU3lzdGVtU2VydmljZX0gZnJvbSAnLi4vLi4vc2VydmVyL2xpYi9zZXJ2aWNlcy9GaWxlU3lzdGVtU2VydmljZVR5cGUnO1xuaW1wb3J0IGludmFyaWFudCBmcm9tICdhc3NlcnQnO1xuXG4vLyBUT0RPOiBSZW1vdmUgdGhpcyBvbmNlIGFsbCBzZXJ2aWNlcyBoYXZlIGJlZW4gbW92ZWQgdG8gZnJhbWV3b3JrIHYzLlxuaW1wb3J0IHtcbiAgZ2V0RmlsZUZvclBhdGgsXG4gIGdldFNlcnZpY2UsXG4gIGdldFNlcnZpY2VMb2dnZXIsXG4gIGdldFNlcnZpY2VCeU51Y2xpZGVVcmksXG59IGZyb20gJy4uLy4uL3JlbW90ZS1jb25uZWN0aW9uJztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGdldEZpbGVGb3JQYXRoLFxuICBnZXRTZXJ2aWNlLFxuICBnZXRTZXJ2aWNlTG9nZ2VyLFxuICBnZXRTZXJ2aWNlQnlOdWNsaWRlVXJpLFxuXG4gIGdldEZpbGVTeXN0ZW1TZXJ2aWNlQnlOdWNsaWRlVXJpKHVyaTogTnVjbGlkZVVyaSk6IEZpbGVTeXN0ZW1TZXJ2aWNlIHtcbiAgICBjb25zdCBzZXJ2aWNlID0gZ2V0U2VydmljZUJ5TnVjbGlkZVVyaSgnRmlsZVN5c3RlbVNlcnZpY2UnLCB1cmkpO1xuICAgIGludmFyaWFudChzZXJ2aWNlKTtcbiAgICByZXR1cm4gc2VydmljZTtcbiAgfSxcbn07XG4iXX0=