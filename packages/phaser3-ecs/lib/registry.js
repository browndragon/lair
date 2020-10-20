"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ecs = require("@browndragon/ecs");

class Registry extends _ecs.Registry {
  constructor(scene) {
    super();
    this.scene = scene;
  }

}

exports.default = Registry;