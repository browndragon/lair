"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _store = _interopRequireDefault(require("./store"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** 2d array stored as x,y coordinates, no indexing. */
class Sparse extends _store.default {
  constructor(key = new.target.key) {
    super();
    this._key = key;
    this.data = new Map();
  }

  get size() {
    return this.data.size;
  }

  get(...k) {
    return this.data.get(this._key(k)).v;
  }

  has(...k) {
    return this.data.has(this._key(k));
  }

  clear() {
    this.data.clear();
    return this;
  }

  swap(v, ...k) {
    let key = this._key(k);

    let data = this.data.get(key);
    this.data.set(key, {
      k,
      v
    });
    return data && data.v;
  }

  pop(...k) {
    let key = this._key(k);

    let data = this.data.get(key);
    this.data.delete(key);
    return data && data.v;
  }

  *entries() {
    for (let {
      k,
      v
    } of this.data.values()) {
      yield [k, v];
    }
  }

  static key(kArray) {
    return kArray.join('|');
  }

}

exports.default = Sparse;