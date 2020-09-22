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
    /** Gets k's value. */
    get(o, k) {
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
        return Object.entries(o);
    },
    keys(o) {
        if (this.isCollection(o)) {
            if ('keys' in o){
                return o.keys();
            }
            let keys = [];
            for (let [k] of this.entries(o)) {
                keys.push(k);
            }
            return keys;
        }
        return Object.keys(o);
    },
    forEach(o, cb, thisArg) {
        for (let [k, v] of this.entries(o)) {
            cb.call(thisArg, v, k, o);
        }
    },
};