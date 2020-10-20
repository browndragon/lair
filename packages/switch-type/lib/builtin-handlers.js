"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = [function literal(obj, cbs) {
  if (obj.constructor !== Object) {
    return undefined;
  }

  return [cbs.literal, cbs.associative];
}, function array(obj, cbs) {
  if (!Array.isArray(obj)) {
    return undefined;
  }

  return [cbs.array, cbs.iterable];
}, function set(obj, cbs) {
  if (!(obj instanceof Set)) {
    return undefined;
  }

  return [cbs.set, cbs.iterable];
}, function map(obj, cbs) {
  if (!(obj instanceof Map)) {
    return undefined;
  }

  return [cbs.map, cbs.associative, cbs.iterable];
}, function iterable(obj, cbs) {
  if (!(Symbol.iterator in obj)) {
    return undefined;
  }

  return [cbs.iterable];
}, function regExp(obj, cbs) {
  if (!(obj instanceof RegExp)) {
    return undefined;
  }

  return [cbs.regExp];
}];
exports.default = _default;