"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  createObjectsFromTileLayer: true,
  createObjectsFromLayer: true,
  createTileLayerFromTileLayer: true,
  createImageLayer: true
};
Object.defineProperty(exports, "createObjectsFromTileLayer", {
  enumerable: true,
  get: function () {
    return _createObjectsFromTileLayer.default;
  }
});
Object.defineProperty(exports, "createObjectsFromLayer", {
  enumerable: true,
  get: function () {
    return _createObjectsFromLayer.default;
  }
});
Object.defineProperty(exports, "createTileLayerFromTileLayer", {
  enumerable: true,
  get: function () {
    return _createTileLayerFromTileLayer.default;
  }
});
Object.defineProperty(exports, "createImageLayer", {
  enumerable: true,
  get: function () {
    return _createImageLayer.default;
  }
});

var _createObjectsFromTileLayer = _interopRequireDefault(require("./createObjectsFromTileLayer"));

var _createObjectsFromLayer = _interopRequireDefault(require("./createObjectsFromLayer"));

var _createTileLayerFromTileLayer = _interopRequireDefault(require("./createTileLayerFromTileLayer"));

var _createImageLayer = _interopRequireDefault(require("./createImageLayer"));

var _types = require("./types");

Object.keys(_types).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _types[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _types[key];
    }
  });
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }