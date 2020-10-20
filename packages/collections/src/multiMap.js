import EmptyIter from './emptyIter';
/**
 * A map whose keys return a cluster of values.
 * 
 * This can be thought of as a set [K, V], which provides an additional index
 * K -> Map(V -> [K, V]). The natural iteration order is over its elements in insertion
 * order (like a set of [K, V]), but the modification operations are in terms of parameters
 * `k, v` not arrays `[k, v]`.
 *
 * Get returns an iterator (specifically, Map.keys).
 */
export default class MultiMap extends Set {
    constructor(iter, ValueMap=Map, KeyMap=Map) {
        super();
        this[K] = new KeyMap();  // K -> V -> [K, V]
        this[V] = ValueMap;
        if (iter) {
            for (let i of iter) {
                this.add(...i);
            }
        }
    }
    get [Symbol.toStringTag]() {
        return `Multimap`;
    }

    add(k, v) {
        const kv = [k, v];
        let vkvs = this[K].get(k);
        if (!vkvs) {
            this[K].set(k, vkvs=new this[V]);
        }
        let old = vkvs.get(v);
        if (old) {
            super.delete(old);
        }
        super.add(kv);
        vkvs.set(v, kv);
        return this;
    }
    clear() {
        this[K].clear();
        return super.clear();
    }
    delete(k, v) {
        let vkvs = this[K].get(k);
        if (!vkvs) {
            return false;
        }
        if (v === undefined) {
            for (let kv of vkvs.values()) {
                super.delete(kv);
            }
        } else {
            let kv = vkvs.get(v);
            if (!kv) {
                return false;
            }
            super.delete(kv);
            vkvs.delete(v);
            if (vkvs.size > 0) {
                // Not empty, so don't destroy it yet.
                return true;
            }
        }
        this[K].delete(k);
        return true;
    }
    entries(k) {
        if (k === undefined) {
            return super.values();
        }
        let vkvs = this[K].get(k);
        if (!vkvs) {
            return EmptyIter;
        }
        return vkvs.values();
    }
    forEach(cb, thisArg, key) {
        for (let [k, v] of this.entries(key)) {
            cb.call(thisArg, v, k, this);
        }
    }
    get(k) {
        return this.values(k);
    }
    has(k, v) {
        let vkvs = this[K].get(k);
        if (v === undefined) {
            return !!vkvs;
        }
        return vkvs.has(v);
    }
    set(k, vs) {
        this.delete(k);
        for (let v of vs) {
            this.add(k, v);
        }
        return this;
    }
    keys() {
        return this[K].keys();
    }
    *values(k) {
        for (let [_, v] of this.entries(k)) {
            yield v;
        }
    }
    [Symbol.iterator]() {
        return this.entries();
    }
}
const K = Symbol('KeyMap');
const V = Symbol('ValueSetClass');