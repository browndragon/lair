"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sorting = _interopRequireDefault(require("./sorting"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** See `Sorting`. */
class SortedMap extends (0, _sorting.default)(Map) {
  *keys(start, end) {
    for (let [k, _] of this.entries(start, end)) {
      yield k;
    }
  }

  set(...params) {
    this.makeDirty();
    return super.set(...params);
  }

  [Symbol.iterator]() {
    return this.entries();
  }

}

exports.default = SortedMap;