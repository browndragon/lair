"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.apply = apply;
exports.default = void 0;

var _phaser3Plugin = _interopRequireDefault(require("@browndragon/phaser3-plugin"));

var _anchor = _interopRequireDefault(require("./anchor"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import Phaser from 'phaser';

/** Constrains two bodies A & B by modeling them as point masses connected by the given force. */
class Pair extends _phaser3Plugin.default.Managed {
  constructor(parent, a, b, force) {
    super(parent);
    this.a = _anchor.default.ensure(a);
    this.b = _anchor.default.ensure(b);
    this.force = force;
    this.lastA = undefined;
    this.lastB = undefined;
  }

  update(elapsed, delta) {
    const a = this.a.object;
    const b = this.b.object;

    if (this.lastA) {
      a.body.acceleration.subtract(this.lastA);
      this.lastA = undefined;
    }

    if (this.lastB) {
      b.body.acceleration.subtract(this.lastB);
      this.lastB = undefined;
    }

    let force = this.force.force(this.a, this.b);

    if (!force) {
      return;
    }

    this.lastA = apply(force.clone(), a);
    this.lastB = apply(force.negate(), b);
  }

}

exports.default = Pair;

function apply(force, object) {
  if (!object) {
    return undefined;
  }

  const body = object.body;

  if (!body) {
    return undefined;
  }

  if (body.immovable) {
    return undefined;
  }

  if (!Number.isFinite(body.mass) || body.mass == 0) {
    return undefined;
  }

  force.scale(1 / body.mass);
  body.acceleration.add(force);
  return force;
}