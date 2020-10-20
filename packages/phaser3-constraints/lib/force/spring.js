"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _force = _interopRequireDefault(require("./force"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Spring extends _force.default {
  constructor(length, stiffness) {
    super();
    this.length = length;
    this.stiffness = stiffness;
  }

  toString() {
    return `Spring(l=${this.length},k=${this.stiffness})`;
  }

  force(pma, pmb) {
    let offset = pma.position.subtract(pmb.position);
    const displacement = this.stiffness * (this.length - offset.length());
    offset.setLength(displacement);
    return offset;
  }

}

exports.default = Spring;