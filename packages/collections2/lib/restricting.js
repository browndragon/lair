"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Restricting = Restricting;
exports.R = exports.RestrictedSet = exports.RestrictedMap = void 0;

/**
 * Makes a datastructure which is es6-like (Set, Map) a "restricting" one, whose iteration methods can be restricted to a "span" on its keylike elements:
 *  * keys for a Map
 *  * values for a Set
 *
 * Your keys should not be mutated while they're in the datastructure!
 */
function Restricting(clazz) {
  if (clazz[R]) {
    return clazz;
  }

  return class extends clazz {
    static get [R]() {
      return true;
    }

    *entries(span) {
      for (let [k, v] of this.entries()) {
        if (span.test(k)) {
          yield v;
        }
      }

      return;
    }

    forEach(cb, thisArg, span) {
      for (let [k, v] of this.entries(span)) {
        cb.call(thisArg, v, k, this);
      }
    } // Set doesn't have `keys` or we'd override that here too.


    *values(span) {
      for (let [_k, v] of this.entries(span)) {
        yield v;
      }
    }

  };
}

class RestrictedMap extends Restricting(Map) {
  *keys(span) {
    for (let [k, _] of this.entries(span)) {
      yield k;
    }
  }

}

exports.RestrictedMap = RestrictedMap;

class RestrictedSet extends Restricting(Set) {}

exports.RestrictedSet = RestrictedSet;
const R = Symbol('IsRestricting');
exports.R = R;