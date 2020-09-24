import Sorting from './sorting';

/** See `Sorting`. */
export default class SortedSet extends Sorting(Set) {
    add(...params) {
        this.makeDirty();
        return super.add(...params);
    }
    [Symbol.iterator]() {
        // The docs imply this is the *initial* value of values, ie, must be overridden.
        return this.values();
    }
}