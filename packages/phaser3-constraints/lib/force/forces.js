"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _force = _interopRequireDefault(require("./force"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** Models multiple forces which are summed together. */
class Forces extends _force.default {
  constructor(...forces) {
    super();
    this.forces = forces;
  }

  force(pma, pmb) {
    let sum = new Phaser.Math.Vector2();

    for (let force of this.forces) {
      let f = force.force(pma, pmb);

      if (f) {
        sum.add(f);
      }
    }

    return sum;
  }

}

exports.default = Forces;