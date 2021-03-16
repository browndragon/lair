"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = val;

function val(f) {
  switch (typeof f) {
    case 'function':
      return f();

    default:
      return f;
  }
}