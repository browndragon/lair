"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Registry", {
  enumerable: true,
  get: function () {
    return _registry.default;
  }
});
Object.defineProperty(exports, "System", {
  enumerable: true,
  get: function () {
    return _system.default;
  }
});

var _registry = _interopRequireDefault(require("./registry"));

var _system = _interopRequireDefault(require("./system"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }