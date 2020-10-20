"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _system.default;
  }
});
Object.defineProperty(exports, "Registry", {
  enumerable: true,
  get: function () {
    return _registry.default;
  }
});
Object.defineProperty(exports, "Scene", {
  enumerable: true,
  get: function () {
    return _scene.default;
  }
});

var _system = _interopRequireDefault(require("./system"));

var _registry = _interopRequireDefault(require("./registry"));

var _scene = _interopRequireDefault(require("./scene"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }