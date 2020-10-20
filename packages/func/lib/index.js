"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Callable", {
  enumerable: true,
  get: function () {
    return _callable.default;
  }
});
Object.defineProperty(exports, "destructure", {
  enumerable: true,
  get: function () {
    return _destructure.default;
  }
});
Object.defineProperty(exports, "switchType", {
  enumerable: true,
  get: function () {
    return _switchType.default;
  }
});

var _callable = _interopRequireDefault(require("@browndragon/callable"));

var _destructure = _interopRequireDefault(require("@browndragon/destructure"));

var _switchType = _interopRequireDefault(require("@browndragon/switch-type"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }