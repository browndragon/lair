"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _intersector = _interopRequireDefault(require("./intersector"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Overlap extends _intersector.default {
  /** Convenience override for intersect. */
  overlap(a, b) {}
  /** Convenience override for intersects. */


  get overlaps() {
    return undefined;
  }
  /** The actual intersection code, called from collider or overlap. */


  intersect(a, b) {
    return this.overlap(a, b);
  }
  /**
   * The set of other pgroup classes or instances to create an intersection against.
   * This does nothing to prevent mutual collision; for an overlap this is fine (both will trigger) but for collision, it's undefined (though often the earlier instantiated of the two, *not always*).
   */


  get intersects() {
    return this.overlaps;
  }

  physicsAddIntersector(targets, process = this.process) {
    this.scene.physics.add.overlap(this, targets, this.intersect, process, this);
  }

}

exports.default = Overlap;