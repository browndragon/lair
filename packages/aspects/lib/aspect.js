"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class Aspect {
  constructor(registry) {
    this[R] = registry;
    this[C] = new Map();
  }

  other(Aspect) {
    return this[R].get(Aspect);
  }

  entries() {
    return this[C].entries();
  }

  has(instance) {
    return this[C].has(instance);
  }

  data(instance) {
    return this[C].get(instance);
  }

  forEach(cb, thisArg) {
    this[C].forEach((data, instance) => cb.call(thisArg, instance, data));
  }

  bind(instance, data) {
    if (data == undefined) {
      return undefined;
    }

    this[C].set(instance, data);
    return data;
  }

  unbind(instance) {
    this[C].delete(instance);
  }

  unregister() {
    for (let instance of this[C].keys()) {
      this.unbind(instance);
    }

    this[R].delete(this.constructor);
    this[R] = undefined;
    this[C] = undefined;
  }

  [Symbol.iterator]() {
    return this.entries();
  }

}

exports.default = Aspect;
const R = Symbol('Registry');
const C = Symbol('Children');