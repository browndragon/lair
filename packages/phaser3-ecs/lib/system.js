"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ecs = require("@browndragon/ecs");

class System extends _ecs.System {
  constructor(context) {
    super(context);
    this[S] = context.registry.scene;
  }

  get scene() {
    return this[S];
  }

  preload() {}

  create() {}

}

exports.default = System;
const S = Symbol('Scene');