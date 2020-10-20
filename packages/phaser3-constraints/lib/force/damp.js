"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _force = _interopRequireDefault(require("./force"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Applies a dampening factor based on the components of relative velocity between the two bodies.
 * This could be used for a directed viscuous field, or added onto an existing force like a spring to represent friction within that spring.
 *
 * The big utility of `damp` as a force is that it's symmetric on the two objects (up to mass) and is calculated based on their relative velocity. Also, phaser arcade physics drag is only applied when acceleration is 0, and under this spring model, that's rarely true.
 */
class Damp extends _force.default {
  /**
   * @param {number} radial - The amount of dampening to exert in the direction between the bodies.
   * @param {number} angular - The amount of dampening to exert to travel perpendicular between the two bodies.
   */
  constructor(damp) {
    super();
    this.damp = damp;
  }

  set damp(damp) {
    console.assert(damp != undefined);
    this._display = damp;
    this._value = -damp / (1 + damp);
  }

  get damp() {
    return this._display;
  }

  toString() {
    return `Damp(${this.damp})`;
  }
  /** By convention, the force on object A. */


  force(pma, pmb) {
    const [_position, velocity] = pma.relative(pmb);
    return velocity.scale(this._value);
  }

}

exports.default = Damp;