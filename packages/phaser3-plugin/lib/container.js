"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _managed = _interopRequireDefault(require("./managed"));

var _parent = _interopRequireDefault(require("./parent"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Container extends (0, _parent.default)(_managed.default) {
  _update(delta) {
    if (!super._update(delta)) {
      return false;
    }

    this._onboardChildren();

    this._updateChildren(delta);

    return true;
  }

}

exports.default = Container;