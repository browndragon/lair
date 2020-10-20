"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = destructureRight;

/**
 * Very similar to array destructuring, returns an array whose first element is the
 * "rest" parameter, and whose trailing elements are the rightmost elements of the array.
 * The default invocation is like a nondestructive `pop` (returning an array of two elements: a) the new array of the frontmost n-1 elements and b) the last element):
 * `const [prefix, elem[-(n)], ...last[-1]] = destructureRight(array, n)`
 * Because this is intended to be used for destructuring assignment, it omits undefined right-
 * hand elements (the destructuring assignment will backfill undefined/defaults as appropriate).
 * This *will* provide undefined entries for lefthand elements that are unsatisfiable
 * (to make assignment in a destructuring easier). 
 */
function destructureRight(array, rightElements = 1, leftElements = 0) {
  const rightElementsAvailable = Math.min(rightElements, array.length);
  const leftElementsAvailable = Math.max(0, Math.min(leftElements, array.length - rightElementsAvailable));
  return [...Array.from({
    length: leftElements
  }, (_, i) => i < leftElementsAvailable ? array[i] : undefined), array.slice(leftElementsAvailable, Math.max(0, array.length - rightElementsAvailable)), ...array.slice(array.length - rightElementsAvailable)];
}