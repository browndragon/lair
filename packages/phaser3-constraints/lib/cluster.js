"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _phaser3Plugin = _interopRequireDefault(require("@browndragon/phaser3-plugin"));

var _anchor = _interopRequireDefault(require("./anchor"));

var _pair = _interopRequireDefault(require("./pair"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import Phaser from 'phaser';

/** Constraints N+1 bodies by creating new pair constraints for each of them to a central object. */
class Cluster extends _phaser3Plugin.default.Container {
  constructor(parent, center, force) {
    super(parent);
    this.center = _anchor.default.ensure(center);
    this.force = force;
  } // Creates a new spring with the same semantics as all of the others between the center object and the new target & offset.


  create({
    target,
    offset
  }) {
    return new _pair.default(this, this.center, _anchor.default.ensure(target, offset), this.force);
  }

}

exports.default = Cluster;