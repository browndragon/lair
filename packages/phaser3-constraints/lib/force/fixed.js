"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _force = _interopRequireDefault(require("./force"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import Phaser from 'phaser';

/** Returns a constant velocity independent of  */
class Fixed extends _force.default {
  constructor(value) {
    super();
    this.value = new Phaser.Math.Vector2(value);
  }

  toString() {
    return `Fixed(${this.value})`;
  }
  /** By convention, the force on object A. */


  force(_pma, _pmb) {
    return this.value.clone();
  }

}

exports.default = Fixed;