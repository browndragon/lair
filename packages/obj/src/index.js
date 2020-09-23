export default {
    isMap(o) {
        return o instanceof Map;
    },
    isCollection(o) {
        return this.isMap(o) || o instanceof Set;
    },
    isLiteral(o) {
        return o && o.constructor === Object;
    },
    isEmptyLiteral(o) {
        if (!this.isLiteral(o)) {
            return false;
        }
        for (let i in o) {
            return false;
        }
        return true;
    },
    isObject(o) {
        if (o == undefined) {  // || null.
            return false;
        }
        return o instanceof Object;
    },

    /** Removes k from o for all k in o. */
    clear(o) {
        if (this.isCollection(o)) {
            o.clear();
            return;
        }
        for (let k of this.keys(o)) {
            this.delete(o, k);
        }
    },
    /** Removes k from o. */
    delete(o, k) {
        if (this.isMap(o)) {
            let v = this.get(o, k);
            o.delete(k);
            return v;
        }
        let v = o[k];
        delete o[k];
        return v;
    },
    /** As `map.has(k)`, or `k in o`. */
    has(o, k) {
        if (this.isMap(o)) {
            return o.has(k);
        }
        if (this.isObject(o)) {
            return k in o;
        }
        return false;
    },
    /** Gets k's value. */
    get(o, k) {
        if (o == undefined) {
            return undefined;
        }
        if (this.isMap(o)) {
            return o.get(k);
        }
        return o[k];
    },
    /** Ignores undefined v; Unconditionally sets k=v, returning its value. */
    set(o, k, v, yesEvenIfUndefined) {
        if (v == undefined && !yesEvenIfUndefined) {
            return v;
        }
        if (this.isMap(o)) {
            o.set(k, v);
            return v;
        }
        return o[k] = v;
    },
    /** Sets k=v returning its previous value (if any). */
    overwrite(o, k, v, yesEvenIfUndefined) {
        let vOld = this.get(o, k);
        this.set(o, k, v, yesEvenIfUndefined);
        return vOld;
    },
    /** Sets k=v if unset, returning k's value now. */
    underwrite(o, k, v, yesEvenIfUndefined) {
        let vOld = this.get(o, k);
        if (vOld == undefined) {
            this.set(o, k, v, yesEvenIfUndefined);
            return v;
        }
        return vOld;
    },

    entries(o) {
        if (this.isCollection(o)) {
            return o.entries();
        }
        if (this.isObject(o)) {
            return Object.entries(o);
        }
        return [];
    },
    keys(o) {
        if (this.isCollection(o)) {
            // Handle maps etc.
            if ('keys' in o) { return o.keys(); }
            // Handle sets (, tables, etc).
            return Array.from(o.entries(), ([v, k]) => k);
        }
        if (this.isObject(o)) {
            return Object.keys(o);
        }
        return [];
    },
    forEach(o, cb, thisArg) {
        if (o == undefined) {
            return;
        }
        for (let [k, v] of this.entries(o)) {
            cb.call(thisArg, v, k, o);
        }
    },
    /** Returns [o[ks[0]], o[ks[0]][ks[1]], ... o[ks[0]][...][ks[n]]]. */
    deepGet(o, ...ks) {
        if (o == undefined) {
            return undefined;
        }
        let ret = [];
        for (let k of ks) {
            o = o[k];
            if (o == undefined) {
                return ret;
            }
            ret.push(o);
        }
        return ret;
    },
    /** Returns an object {k0:{k1:{...kn-1:kn}}} */
    wrap(...ks) {
        let v = ks.pop();
        for (let k of ks.reverse()) {
            v = {[k]:v};
        }
        return v;
    },
};