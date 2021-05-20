"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Cursors", {
  enumerable: true,
  get: function () {
    return _cursors.default;
  }
});
Object.defineProperty(exports, "MapScene", {
  enumerable: true,
  get: function () {
    return _mapScene.default;
  }
});
Object.defineProperty(exports, "Scene", {
  enumerable: true,
  get: function () {
    return _scene.default;
  }
});
Object.defineProperty(exports, "Spring", {
  enumerable: true,
  get: function () {
    return _spring.default;
  }
});
Object.defineProperty(exports, "ticknudge", {
  enumerable: true,
  get: function () {
    return _ticknudge.default;
  }
});
exports.Tilemaps = exports.GOs = exports.AI = void 0;

var AI = _interopRequireWildcard(require("./ai"));

exports.AI = AI;

var GOs = _interopRequireWildcard(require("./gos"));

exports.GOs = GOs;

var Tilemaps = _interopRequireWildcard(require("./tilemaps"));

exports.Tilemaps = Tilemaps;

var _cursors = _interopRequireDefault(require("./cursors"));

var _mapScene = _interopRequireDefault(require("./mapScene"));

var _scene = _interopRequireDefault(require("./scene"));

var _spring = _interopRequireDefault(require("./spring"));

var _ticknudge = _interopRequireDefault(require("./ticknudge"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }