

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

var flatten = require('../../utils/flatten');
var markers = require('../../constants/markers');

function printCatchClause(print, node) {
  return flatten(['catch (', markers.openScope, markers.scopeIndent, markers.scopeBreak, print(node.param), markers.scopeBreak, markers.scopeDedent, markers.closeScope, ')', markers.noBreak, markers.space, print(node.body)]);
}

module.exports = printCatchClause;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByaW50Q2F0Y2hDbGF1c2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQWNBLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0FBQy9DLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDOztBQUVuRCxTQUFTLGdCQUFnQixDQUFDLEtBQVksRUFBRSxJQUFpQixFQUFTO0FBQ2hFLFNBQU8sT0FBTyxDQUFDLENBQ2IsU0FBUyxFQUNULE9BQU8sQ0FBQyxTQUFTLEVBQ2pCLE9BQU8sQ0FBQyxXQUFXLEVBQ25CLE9BQU8sQ0FBQyxVQUFVLEVBQ2xCLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQ2pCLE9BQU8sQ0FBQyxVQUFVLEVBQ2xCLE9BQU8sQ0FBQyxXQUFXLEVBQ25CLE9BQU8sQ0FBQyxVQUFVLEVBQ2xCLEdBQUcsRUFDSCxPQUFPLENBQUMsT0FBTyxFQUNmLE9BQU8sQ0FBQyxLQUFLLEVBQ2IsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FDakIsQ0FBQyxDQUFDO0NBQ0o7O0FBRUQsTUFBTSxDQUFDLE9BQU8sR0FBRyxnQkFBZ0IsQ0FBQyIsImZpbGUiOiJwcmludENhdGNoQ2xhdXNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG4vKiBAZmxvdyAqL1xuXG4vKlxuICogQ29weXJpZ2h0IChjKSAyMDE1LXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIGxpY2Vuc2UgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBpblxuICogdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuaW1wb3J0IHR5cGUge0NhdGNoQ2xhdXNlfSBmcm9tICdhc3QtdHlwZXMtZmxvdyc7XG5pbXBvcnQgdHlwZSB7TGluZXMsIFByaW50fSBmcm9tICcuLi8uLi90eXBlcy9jb21tb24nO1xuXG5jb25zdCBmbGF0dGVuID0gcmVxdWlyZSgnLi4vLi4vdXRpbHMvZmxhdHRlbicpO1xuY29uc3QgbWFya2VycyA9IHJlcXVpcmUoJy4uLy4uL2NvbnN0YW50cy9tYXJrZXJzJyk7XG5cbmZ1bmN0aW9uIHByaW50Q2F0Y2hDbGF1c2UocHJpbnQ6IFByaW50LCBub2RlOiBDYXRjaENsYXVzZSk6IExpbmVzIHtcbiAgcmV0dXJuIGZsYXR0ZW4oW1xuICAgICdjYXRjaCAoJyxcbiAgICBtYXJrZXJzLm9wZW5TY29wZSxcbiAgICBtYXJrZXJzLnNjb3BlSW5kZW50LFxuICAgIG1hcmtlcnMuc2NvcGVCcmVhayxcbiAgICBwcmludChub2RlLnBhcmFtKSxcbiAgICBtYXJrZXJzLnNjb3BlQnJlYWssXG4gICAgbWFya2Vycy5zY29wZURlZGVudCxcbiAgICBtYXJrZXJzLmNsb3NlU2NvcGUsXG4gICAgJyknLFxuICAgIG1hcmtlcnMubm9CcmVhayxcbiAgICBtYXJrZXJzLnNwYWNlLFxuICAgIHByaW50KG5vZGUuYm9keSksXG4gIF0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHByaW50Q2F0Y2hDbGF1c2U7XG4iXX0=