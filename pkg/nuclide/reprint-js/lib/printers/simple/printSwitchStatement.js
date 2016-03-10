

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

var markers = require('../../constants/markers');
var wrapStatement = require('../../wrappers/simple/wrapStatement');

function printSwitchStatement(print, node) {
  var wrap = function wrap(x) {
    return wrapStatement(print, node, x);
  };
  return wrap([markers.hardBreak, 'switch (', markers.openScope, markers.scopeIndent, markers.scopeBreak, print(node.discriminant), markers.scopeBreak, markers.scopeDedent, markers.closeScope, ') {', markers.hardBreak, markers.indent, node.cases.map(function (caseNode) {
    return print(caseNode);
  }), markers.noBreak, // Squash the last breaks.
  '', markers.dedent, markers.hardBreak, '}']);
}

module.exports = printSwitchStatement;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByaW50U3dpdGNoU3RhdGVtZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFjQSxJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMseUJBQXlCLENBQUMsQ0FBQztBQUNuRCxJQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMscUNBQXFDLENBQUMsQ0FBQzs7QUFFckUsU0FBUyxvQkFBb0IsQ0FBQyxLQUFZLEVBQUUsSUFBcUIsRUFBUztBQUN4RSxNQUFNLElBQUksR0FBRyxTQUFQLElBQUksQ0FBRyxDQUFDO1dBQUksYUFBYSxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0dBQUEsQ0FBQztBQUNoRCxTQUFPLElBQUksQ0FBQyxDQUNWLE9BQU8sQ0FBQyxTQUFTLEVBQ2pCLFVBQVUsRUFDVixPQUFPLENBQUMsU0FBUyxFQUNqQixPQUFPLENBQUMsV0FBVyxFQUNuQixPQUFPLENBQUMsVUFBVSxFQUNsQixLQUFLLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUN4QixPQUFPLENBQUMsVUFBVSxFQUNsQixPQUFPLENBQUMsV0FBVyxFQUNuQixPQUFPLENBQUMsVUFBVSxFQUNsQixLQUFLLEVBQ0wsT0FBTyxDQUFDLFNBQVMsRUFDakIsT0FBTyxDQUFDLE1BQU0sRUFDZCxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFBLFFBQVE7V0FBSSxLQUFLLENBQUMsUUFBUSxDQUFDO0dBQUEsQ0FBQyxFQUMzQyxPQUFPLENBQUMsT0FBTztBQUNmLElBQUUsRUFDRixPQUFPLENBQUMsTUFBTSxFQUNkLE9BQU8sQ0FBQyxTQUFTLEVBQ2pCLEdBQUcsQ0FDSixDQUFDLENBQUM7Q0FDSjs7QUFFRCxNQUFNLENBQUMsT0FBTyxHQUFHLG9CQUFvQixDQUFDIiwiZmlsZSI6InByaW50U3dpdGNoU3RhdGVtZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG4vKiBAZmxvdyAqL1xuXG4vKlxuICogQ29weXJpZ2h0IChjKSAyMDE1LXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIGxpY2Vuc2UgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBpblxuICogdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuaW1wb3J0IHR5cGUge0xpbmVzLCBQcmludH0gZnJvbSAnLi4vLi4vdHlwZXMvY29tbW9uJztcbmltcG9ydCB0eXBlIHtTd2l0Y2hTdGF0ZW1lbnR9IGZyb20gJ2FzdC10eXBlcy1mbG93JztcblxuY29uc3QgbWFya2VycyA9IHJlcXVpcmUoJy4uLy4uL2NvbnN0YW50cy9tYXJrZXJzJyk7XG5jb25zdCB3cmFwU3RhdGVtZW50ID0gcmVxdWlyZSgnLi4vLi4vd3JhcHBlcnMvc2ltcGxlL3dyYXBTdGF0ZW1lbnQnKTtcblxuZnVuY3Rpb24gcHJpbnRTd2l0Y2hTdGF0ZW1lbnQocHJpbnQ6IFByaW50LCBub2RlOiBTd2l0Y2hTdGF0ZW1lbnQpOiBMaW5lcyB7XG4gIGNvbnN0IHdyYXAgPSB4ID0+IHdyYXBTdGF0ZW1lbnQocHJpbnQsIG5vZGUsIHgpO1xuICByZXR1cm4gd3JhcChbXG4gICAgbWFya2Vycy5oYXJkQnJlYWssXG4gICAgJ3N3aXRjaCAoJyxcbiAgICBtYXJrZXJzLm9wZW5TY29wZSxcbiAgICBtYXJrZXJzLnNjb3BlSW5kZW50LFxuICAgIG1hcmtlcnMuc2NvcGVCcmVhayxcbiAgICBwcmludChub2RlLmRpc2NyaW1pbmFudCksXG4gICAgbWFya2Vycy5zY29wZUJyZWFrLFxuICAgIG1hcmtlcnMuc2NvcGVEZWRlbnQsXG4gICAgbWFya2Vycy5jbG9zZVNjb3BlLFxuICAgICcpIHsnLFxuICAgIG1hcmtlcnMuaGFyZEJyZWFrLFxuICAgIG1hcmtlcnMuaW5kZW50LFxuICAgIG5vZGUuY2FzZXMubWFwKGNhc2VOb2RlID0+IHByaW50KGNhc2VOb2RlKSksXG4gICAgbWFya2Vycy5ub0JyZWFrLCAvLyBTcXVhc2ggdGhlIGxhc3QgYnJlYWtzLlxuICAgICcnLFxuICAgIG1hcmtlcnMuZGVkZW50LFxuICAgIG1hcmtlcnMuaGFyZEJyZWFrLFxuICAgICd9JyxcbiAgXSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcHJpbnRTd2l0Y2hTdGF0ZW1lbnQ7XG4iXX0=