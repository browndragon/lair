import Sorting from './sorting';

/** See `Sorting`. */
export default class SortedMap extends Sorting(Map) {
    *keys(start, end) {
        for (let [k, _] of this.entries(start, end)) {
            yield k;
        }
    }
    set(...params) {
        this.makeDirty();
        return super.set(...params);
    }
    [Symbol.iterator]() {
        return this.entries();
    }
}
