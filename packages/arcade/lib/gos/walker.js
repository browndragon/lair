"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = walker;

var _embody = _interopRequireDefault(require("./embody"));

var _facer = _interopRequireDefault(require("./facer"));

var _scoped = _interopRequireDefault(require("./scoped"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function walker(clazz) {
  return class extends (0, _facer.default)((0, _scoped.default)(clazz)) {
    get infix() {
      return this.body && this.body.velocity.lengthSq() > 1 ? 'walk' : 'stand';
    }

    get suffix() {
      return this.facingQuadrant;
    }

    walkAlong(vector) {
      this.body.velocity.setFromObject(vector);

      if (vector.lengthSq() > 1) {
        this.facingVector = vector;
      }

      this.play(undefined, true);
    }

    addedToScene() {
      super.addedToScene();
      (0, _embody.default)(this);
    }

  };
}