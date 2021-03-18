"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/** Stores a mapping (x,y)=>v. Works best for numerical keys. */
class Store {
  swap(v, ...k) {
    throw 'unimplemented';
  }

  pop(...k) {
    throw 'unimplemented';
  }

  clear() {
    throw 'unimplemented';
  }

  get(...k) {
    throw 'unimplemented';
  } // Should this just be `get != undefined`? *wouldn't that be nice*.


  has(...k) {
    throw 'unimplemented';
  }

  get size() {
    throw 'unimplemented';
  }

  entries() {
    throw 'unimplemented';
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

  set(v, ...k) {
    this.swap(v, ...k);
    return this;
  }

  delete(...k) {
    this.pop(...k);
    return this;
  }
  /**
   * Read/Modify/Writes a callback `cb` @ `...k`.
   *
   * The callback cb is invoked with the 2 parameters a) the value at `...k` (exactly as from `.get`) and b) the array value `k`.
   * This value is written back into the store and returned.
   * For instance, `let newvalue = store.rmw(v=>1+(v||0), 1, 2, 3)` implements "increment @ position 1,2,3".
   * As a special favor, this can *also* delete if it returns the Store.RMWDelete symbol (in which case it ambiguously returns undefined). That's probably VERY rare though; much more common are the helper `inc`, `bitwiseOr`, `push` and `setAdd` methods. */


  rmw(cb, ...k) {
    const newValue = cb(this.get(...k), ...k);

    if (newValue == this.constructor.RMWDelete) {
      this.pop(...k);
      return undefined;
    } else {
      this.swap(newValue, ...k);
    }

    return newValue;
  }

}

exports.default = Store;
Store.RMWDelete = Symbol('RMWDelete');