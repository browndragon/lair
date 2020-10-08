/**
 * Exposes a tree matching the inheritance hierarchy of a type.
 * Root: The base type to store.
 * Leaf: An instance of a specific class.
 * Intermediate nodes: Intermediate objects per the prototype chain.
 */
export default class ClassTree {
    constructor(rootClass) {
        this.rootClass = rootClass;
        this.root = new Map();
    }
    add(clazz) {
        let node = this.root();
        let parent = node;
        for (let proto of _prototypeChain(clazz.prototype, this.rootClass.prototype)) {
            parent = node;
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
    call(instance) {
        // TODO: Continue development.
        throw 'unimplemented';
    }
}
function _prototypeChain(clazzPrototype, rootClassPrototype) {
    let chain = [];
    while (true) {
        if (clazz == undefined) {
            return chain;
        }
        chain.push(clazz);
        if (clazzPrototype == rootClassPrototype) {
            return chain;
        }
        if (clazz == Object.prototype) {
            throw new TypeError(`Never encountered root class ${rootClassPrototype}`);
        }
        clazz = Object.getPrototypeOf(clazz);
    }
    return chain.reverse();
}
function _visit(clazzPrototypeMap, cb) {
    for (let [clazzPrototype, children] of clazzPrototypeMap) {
        /** clazz & isLeaf */
        if (cb(clazzPrototype, !children)) {
            _visit(children, cb);
        }
    }
}