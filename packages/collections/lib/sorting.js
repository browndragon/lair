import bs from 'binary-search';

/**
 * Makes a datastructure which is es6-like (Set, Map) a "sorting" one, overriding the documented
 * sort order in favor of a natural ordering of its keylike elements:
 *  * keys for a Map
 *  * values for a Set
 *
 * Your keys should not be mutated while they're in the datastructure! If you must mutate them,
 * you must call `makeDirty` on the data structure to invalidate its sorted cache.
 *
 * By default, this uses `<`; if you need more complex sorting of your data, pass an alternative
 * `comparator` to the constructor.
 *
 * The internal sort order is based on the `entries` method, which in turn caches its iteration
 * order until a call is made to mutate this datastructure (extending classes must enforce this
 * by calling `makeDirty`). `entries` and all methods which call into it are augmented with
 * optional parameters `start` (inclusive) and `end` (exclusive).
 * Modifications to the datastructure mid-iteration will only be seen past the current point
 * of iteration (so inserting something alphabetically earlier will be missed).
 */
export default function Sorting(clazz) {
    return class extends clazz {
        constructor(...params) {
            super(...params);
            this[E] = undefined;
            this[CC] = DEFAULT_COMPARATOR;
        }

        get [Symbol.toStringTag]() {
            return `Sorted${super[Symbol.toStringTag]}`;
        }

        static comparing(comparator) {
            console.assert(typeof comparator == 'function');
            return class extends this {
                constructor(...params) {
                    super(...params);
                    this[CC] = ([k1], [k2]) => comparator(k1, k2);
                }
            };
        }
        clear() {
            this.makeDirty();
            return super.clear();
        }
        delete(...params) {
            this.makeDirty();
            return super.delete(...params);
        }
        /**
         * Invalidates the sorted key cache.
         */
        makeDirty() {
            this[E] = undefined;
        }
        preSort(entries) {}
        postSort(entries) {}
        entries(start, end) {
            if (!this[E]) {
                this[E] = Array.from(super.entries());
                this.preSort(this[E]);
                this[E] = this[E].sort(this[CC]);
                this.postSort(this[E]);
            }
            return iteratorBetween(this[E], this[CC], start, end);
        }
        forEach(cb, thisArg, start, end) {
            for (let [k, v] of this.entries(start, end)) {
                cb.call(thisArg, v, k, this);
            }
        }
        // Set doesn't have `keys` or we'd override that here too.
        *values(start, end) {
            for (let [k, v] of this.entries(start, end)) {
                yield v;
            }
        }
    };
}
const E = Symbol('SortedEntries');
const CC = Symbol('CompareClosure');
export const DEFAULT_COMPARATOR = ([k1], [k2]) => k1 > k2 ? 1 : k1 < k2 ? -1 : 0;

function* iteratorBetween(entries, comparator, start, end) {
    let index = start === undefined ? 0 : bs(entries, [start], comparator);
    if (index < 0) {
        // On miss, the library is documented to return -(index+1).
        // 
        index = -(index + 1);
    }
    const guard = end === undefined ? undefined : [end];
    for (let i = index; i < entries.length; ++i) {
        if (guard && comparator(entries[i], guard) >= 0) {
            return;
        }
        yield entries[i];
    }
}