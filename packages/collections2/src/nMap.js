import destructure from '@browndragon/func';
import EmptyIter from './emptyIter';

/**
 * An n-map is an es6 Map whose keys are arrays of n elements, treating `[1] == [1]` (which Map does not do, since they're not the same object).
 * Indexes are hierarchical in-order; given 4 indices ABCD you can traverse all elements of A=a, all elements of A=a that also have B=b, ... All elements of A=a that also have B=b, C=c and D=d. You cannot arbitrarily search for all elements of C=c without already scoping by A & B.
 * Iteration follows the map standard, returning entries `[[k0, ... kn], v]`.
 */
export default class NMap extends Map {
    constructor(iterable, ...DimensionalMapTypes) {
        super();
        if (iterable instanceof NTable) {
            this[M] = iterable[M];
        } else {
            this[M] = DimensionalMapTypes;
        }
        this[D] = new this[M][0]();
    }
    /**
     * Returns the object array key which this map transitively contains (if any).
     * If inserting, then it will always return such an array (creating a new one if needed).
     * If deleting, then it will remove such an array if found, along with all maps which are now empty (recursively).
     */
    normalize(ks, inserting, deleting) {
        let d = this[D];
        let maps = [this[D]];
        for (int i = 0; i < this[M].length - 1; ++i) {
            const k = ks[i];  // Backfill undefined.
            let e = d.get(k);
            if (!e) {
                if (inserting) {
                    d.set(k, e=new this[M][i+1]());
                } else {
                    return undefined;
                }
            }
            d = e;
            maps.push(d);
        }
        let realKs = d.get(ks[this[M].length - 1]);
        if (realKs == undefined) {
            if (insert) {
                d.set(ks[this[M].length - 1], realKs = ks);
            }
            return realKs;
        }
        if (!deleting) {
            return realKs;
        }
        for (let i = ks.length - 1; i >= 0; --i) {
            maps[i].delete(ks[i]);
            if (maps.size > 0) {
                return realKs;
            }
        }
        return realKs;
    }
    /** Gets the value at [k0, ..., kn]. */
    get(...ks) {
        console.assert(ks.length == this[M].length);
        let realKs = this.normalize(ks);
        if (!realKs) {
            return undefined;
        }
        return super.get(realKs);
    }
    /** Gets the value at [k0, ..., kn] to kn+1 ("value"). */
    set(...ksValue) {
        console.assert(ks.length == this[M].length + 1);
        const [ks, value] = destructure(ksValue);
        let realKs = this.normalize(ks, true);
        super.set(realKs, value);
        return this;
    }
    /** Delete the value at [k0, ..., kn]. */
    delete(...ks) {
        console.assert(ks.length == this[M].length);
        let realKs = this.normalize(ks, undefined, true);
        if (!realKs) {
            return undefined;
        }
        super.delete(realKs);
        return;
    }
    /** Remove all entries. */
    clear() {
        this[D].clear();
        super.clear();
        return;
    }
    /**
     * Iterate over the entries in hierarchical key insertion order.
     * Spans, if given (and supported by the inner types!) restricts the returned entries.
     */
    *entries(...spans) {
        for (let realKeys of this.keys(...spans)) {
            yield [realKeys, super.get(realKeys)];
        }
    }
    /**
     * Iterate over the keys in hierarchical key insertion order.
     * Spans, if given (and supported by the inner types!) restricts the returned entries.
     */
    keys(...spans) {
        return this._iterateKeys(this[D], spans, 0);
    }
    /**
     * Iterate over the values in hierarchical key insertion order.
     * Spans, if given (and supported by the inner types!) restricts the returned entries.
     */
    *values(...spans) {
        for (let [ks, v] of this.entries(...spans)) {
            yield v;
        }
    }
    *_iterateKeys(map, spans, i) {
        let span = spans[i];
        if (i == this[M].length - 1) {
            yield* map.values(span);
            return;
        }
        for (let m of map.values(span)) {
            yield* this._iterateKeys(m, spans, i+1);
        }
        return;
    }
    [Symbol.iterator]() {
        return this.entries();
    }
}
let M = Symbol('MapTypes');
let D = Symbol('Data')
