"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sorting = _interopRequireDefault(require("./sorting"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** See `Sorting`. */
class SortedSet extends (0, _sorting.default)(Set) {
  add(...params) {
    this.makeDirty();
    return super.add(...params);
  }

  [Symbol.iterator]() {
    // The docs imply this is the *initial* value of values, ie, must be overridden.
    return this.values();
  }

}

exports.default = SortedSet;