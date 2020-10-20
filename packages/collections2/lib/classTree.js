"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/**
 * Exposes a tree matching the inheritance hierarchy of a type.
 * Root: The base type to store.
 * Leaf: An instance of a specific class.
 * Intermediate nodes: Intermediate objects per the prototype chain.
 */
class ClassTree {
  constructor(rootClass) {
    this.rootClass = rootClass;
    this.root = new Map();
  }

  add(clazz) {
    let node = this.root();
    let _parent = node;

    for (let proto of _prototypeChain(clazz.prototype, this.rootClass.prototype)) {
      _parent = node;
      let next = node.get(proto);

      if (next == undefined) {
        node.set(proto, next = new Map());
      }

      node = next;
    }
  }

  visit(cb) {
    _visit(this.root, cb);
  }

  call(_instance) {
    // TODO: Continue development.
    throw 'unimplemented';
  }

}

exports.default = ClassTree;

function _prototypeChain(clazzPrototype, rootClassPrototype) {
  let chain = [];

  for (;;) {
    if (clazzPrototype == undefined) {
      return chain.reverse();
    }

    chain.push(clazzPrototype);

    if (clazzPrototype == rootClassPrototype) {
      return chain.reverse();
    }

    if (clazzPrototype == Object.prototype) {
      throw new TypeError(`Never encountered root class ${rootClassPrototype}`);
    }

    clazzPrototype = Object.getPrototypeOf(clazzPrototype);
  }
}

function _visit(clazzPrototypeMap, cb) {
  for (let [clazzPrototype, children] of clazzPrototypeMap) {
    /** clazz & isLeaf */
    if (cb(clazzPrototype, !children)) {
      _visit(children, cb);
    }
  }
}