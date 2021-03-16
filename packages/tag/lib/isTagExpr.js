"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isTagExpr;

/** Returns true if we strongly believe the parameters to be tagged template string-y. */
function isTagExpr(strings, params) {
  return Array.isArray(strings) && strings.raw;
}