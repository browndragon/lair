"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _intersector = _interopRequireDefault(require("./intersector"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Collider extends _intersector.default {
  /** Convenience override for intersect. */
  collider(a, b) {}
  /** Convenience override for intersects. */


  get colliders() {
    return undefined;
  }
  /** The actual intersection code, called from collider or overlap. */


  intersect(a, b) {
    return this.collider(a, b);
  }
  /**
   * The set of other pgroup classes or instances to create an intersection against.
   * This does nothing to prevent mutual collision; for an overlap this is fine (both will trigger) but for collision, it's undefined (though often the earlier instantiated of the two, *not always*).
   */


  get intersects() {
    return this.colliders;
  }

  physicsAddIntersector(targets, intersect = this.intersect) {
    this.scene.physics.add.collider(this, targets, intersect, this.process, this);
  }

}

exports.default = Collider;