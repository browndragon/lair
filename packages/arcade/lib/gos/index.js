"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Corners", {
  enumerable: true,
  get: function () {
    return _corners.default;
  }
});
Object.defineProperty(exports, "embody", {
  enumerable: true,
  get: function () {
    return _embody.default;
  }
});
Object.defineProperty(exports, "facer", {
  enumerable: true,
  get: function () {
    return _facer.default;
  }
});
Object.defineProperty(exports, "scoped", {
  enumerable: true,
  get: function () {
    return _scoped.default;
  }
});
Object.defineProperty(exports, "walker", {
  enumerable: true,
  get: function () {
    return _walker.default;
  }
});
exports.Wobbler = exports.Walker = void 0;

var _corners = _interopRequireDefault(require("./corners"));

var _embody = _interopRequireDefault(require("./embody"));

var _facer = _interopRequireDefault(require("./facer"));

var _scoped = _interopRequireDefault(require("./scoped"));

var _walker = _interopRequireDefault(require("./walker"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Walker = (0, _walker.default)(Phaser.Physics.Arcade.Sprite);
exports.Walker = Walker;
const Wobbler = (0, _scoped.default)(Phaser.Physics.Arcade.Sprite);
exports.Wobbler = Wobbler;