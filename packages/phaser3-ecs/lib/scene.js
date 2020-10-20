"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _registry = _interopRequireDefault(require("./registry"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Peer dependency, don't import or you'll get a second copy! Use the global instead.
// import Phaser from 'phaser';
class Scene extends Phaser.Scene {
  constructor(...params) {
    super(...params);
    this[R] = new _registry.default(this);
  }

  runSystem(System) {
    this[R].register(System);
    return this;
  }

  addEntity(gameObject, pin = undefined) {
    this[R].observe(gameObject, pin);
  }

  removeEntity(gameObject) {
    this[R].remove(gameObject);
  }

  preload() {
    this[R].forEachSystem(preload);
  }

  create() {
    this[R].forEachSystem(create);
  }

  update(time, delta) {
    this[R].update(time, delta);
  }

}

exports.default = Scene;

function preload(s) {
  s.preload();
}

function create(s) {
  s.create();
}

const R = Symbol('Registry');