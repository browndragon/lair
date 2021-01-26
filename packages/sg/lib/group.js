"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _registrar = _interopRequireDefault(require("./registrar"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import Phaser from 'phaser'l

/**
 * Provides scene-scoped singleton Group instances with `(new (MyGroup extends Group {})).group(someScene)`.
 * Most of the time, what you actually want is a PGroup (which has physics & collider support). But this is here just in case.
 * Sometimes, what you want is an LGroup (which has tilemap layer support).
 */
class Group extends (0, _registrar.default)(Phaser.GameObjects.Group) {}

exports.default = Group;