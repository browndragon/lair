"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  done: true,

  next() {
    return this;
  },

  [Symbol.iterator]() {
    return this;
  }

};
exports.default = _default;