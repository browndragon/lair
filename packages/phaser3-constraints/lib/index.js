"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _anchor = _interopRequireDefault(require("./anchor"));

var _cluster = _interopRequireDefault(require("./cluster"));

var _corner = _interopRequireDefault(require("./corner"));

var _pair = _interopRequireDefault(require("./pair"));

var _plugin = _interopRequireDefault(require("./plugin"));

var Force = _interopRequireWildcard(require("./force"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  Anchor: _anchor.default,
  Cluster: _cluster.default,
  Corner: _corner.default,
  Pair: _pair.default,
  Plugin: _plugin.default,
  ...Force
};
exports.default = _default;