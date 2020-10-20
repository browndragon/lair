"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/** es6 fake a Callable class. */
class Callable extends Function {
  constructor(f) {
    return Object.setPrototypeOf(f, new.target.prototype);
  }

}

exports.default = Callable;