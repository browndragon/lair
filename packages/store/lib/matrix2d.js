"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sparse = _interopRequireDefault(require("./sparse"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** Similar to store, but explicitly caps to 2 dimensions, and so puts coordinates before value for e.g. `set`. */
class Matrix2d {
  constructor(...params) {
    this.store = new.target.store(...params);
  }

  static store(...params) {
    return new _sparse.default(...params);
  }

  swap(u, v, d) {
    return this.store.swap(d, u, v);
  }

  pop(u, v) {
    return this.store.pop(u, v);
  }

  clear() {
    this.store.clear();
    return this;
  }

  get(u, v) {
    return this.store.get(u, v);
  }

  has(u, v) {
    return this.store.has(u, v);
  }

  get size() {
    return this.store.size;
  }

  entries() {
    return this.store.entries();
  } // Everything else *including standard setters!* is defined in terms of the above operations. */


  *keys() {
    for (let [k, _] of this) {
      yield k;
    }
  }

  *values() {
    for (let [_, v] of this) {
      yield v;
    }
  }

  [Symbol.iterator]() {
    return this.entries();
  }

  set(u, v, d) {
    this.store.set(d, u, v);
    return this;
  }

  delete(u, v) {
    this.store.delete(u, v);
    return this;
  } // Aggregation methods for holding additional data at a specific location.

  /** Assuming numerical values; returns the increment'd value. */


  inc(u, v, increment = 1, initial = 0) {
    this.store.rmw(d => increment + (d || initial), u, v);
  }
  /** Assuming numerical values; returns the or'd pattern. */


  bitwiseOr(u, v, pattern, initial = 0) {
    this.store.rmw(d => pattern | (d || initial), u, v);
  }
  /** Assuming `[]` values; returns the resultant array. */


  arrayPush(u, v, datum, arrayClass = Array) {
    this.store.rmw(d => {
      let array = d || new arrayClass();
      array.push(datum);
      return array;
    }, u, v);
  }
  /** Assuming `[]` values; returns the popped value. */


  arrayPop(u, v) {
    let array = this.get(u, v);
    return array && array.pop();
  }
  /** Assuming `Set` values; returns the set with datum. */


  setAdd(u, v, datum, setClass = Set) {
    this.store.rmw(d => (d || new setClass()).add(datum), u, v);
  }
  /** Assuming `Set` values; returns true if the element was already in the set. */


  setDelete(u, v, datum) {
    let set = this.get(u, v);
    return set && set.delete(datum);
  }

}

exports.default = Matrix2d;