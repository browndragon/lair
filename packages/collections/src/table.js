import EmptyIter from './emptyIter';
import SortedMap from './sortedMap';

/**
 * Table exposes a 2-dimensional array (by default sorted!) of Rows and Columns,
 * whose intersections are unique Values (or cells). It can be thought of as a
 * Set of [[row, col], value] entries. It additionally exposes methods to work with
 * its rows, columns, keys, values, and combinations thereof.
 * Methods like `entries` (, `forEach`, `keys`, `values`) obey the Map contract and
 * act in value insertion order.
 * Methods like `entriesInRow` (, `forEachInRow`, `keysInRow`, `valuesInRow`, and the
 * same for Col) obey whatever `RowMap` is overridden to return (equivalently, `ColMap`),
 * which is by default a SortedMap (which is by default natural `<` ordering). These methods
 * accept trailing `start` & `end` parameters which are forwarded to the SortedMap.
 */
export default class Table extends Set {
    constructor(iterable, RowMap=SortedMap, ColMap=SortedMap) {
        super();
        this[M] = {RowMap, ColMap};
        this[R] = new RowMap();  // r -> c -> [[r, c], v]
        this[C] = new ColMap();  // c -> r -> [[r, c], v]
        if (iterable) {
            for (let [[r, c], v] of iterable) {
                this.set(r, c, v);
            }
        }
    }

    get [Symbol.toStringTag]() {
        return 'Table';
    }

    clear() {
        this[R].clear();
        this[C].clear();
        super.clear();
    }

    delete(r, c) {
        let s1 = destructiveDeref(this[R], r, c);
        let s2 = destructiveDeref(this[C], c, r);
        console.assert(s1 === s2);
        if (s1 === undefined) {
            return false;
        }
        return super.delete(s1);
    }
    deleteRow(r) {
        let entries = deleteLine(this[R], r, this[C]);
        for (let entry of entries) {
            super.delete(entry);
        }
        return entries.size;
    }
    deleteCol(c) {
        let entries = deleteLine(this[C], c, this[R]);
        for (let entry of entries) {
            super.delete(entry);
        }
        return entries.size;
    }

    entries() {
        return super.values();
    }
    entriesInRow(r, start, end) {
        return iterateEntriesInLine(this[R].get(r), start, end);
    }
    entriesInCol(c, start, end) {
        return iterateEntriesInLine(this[C].get(c), start, end);
    }
    forEach(callback, thisArg) {
        for (let [k, v] of this.entries()) {
            callback.call(thisArg, v, k, this);
        }
    }
    forEachInRow(r, callback, thisArg, start, end) {
        for (let [k, v] of this.entriesInRow(r, start, end)) {
            callback.call(thisArg, v, k, this);
        }
    }
    forEachInCol(c, callback, thisArg, start, end) {
        for (let [k, v] of this.entriesInCol(c, start, end)) {
            callback.call(thisArg, v, k, this);
        }
    }

    get(r, c) {
        let cols = this[R].get(r);
        if (!cols) {
            return undefined;
        }
        let s = cols.get(c);
        if (!s) {
            return undefined;
        }
        return s[1];
    }

    has(r, c) {
        let cols = this[R].get(r);
        if (!cols) {
            return undefined;
        }
        return cols.has(c);
    }
    hasRow(r) {
        return this[R].has(r);
    }
    hasCol(c) {
        return this[C].has(c);
    }

    *keys() {
        for (let [[r, c], _] of this.entries()) {
            yield [r, c];
        }
    }
    *keysInRow(r, start, end) {
        for (let c of this.colsInRow(r, start, end)) {
            yield [r, c];
        }
    }
    *keysInCol(c, start, end) {
        for (let r of this.rowsInCol(c, start, end)) {
            yield [r, c];
        }
    }
    rowKeys(start, end) {
        return this[R].keys(start, end);
    }
    colKeys(start, end) {
        return this[C].keys(start, end);
    }
    colsInRow(r, start, end) {
        let line = this[R].get(r);
        if (!line) {
            return EmptyIter;
        }
        return line.keys(start, end);
    }
    rowsInCol(c, start, end) {
        let line = this[C].get(c);
        if (!line) {
            return EmptyIter;
        }
        return line.keys(start, end);
    }

    set(r, c, v) {
        const inserting = [[r, c], v];
        let oldR = insertInto(this[R], r, c, this[M].ColMap, inserting);
        let oldC = insertInto(this[C], c, r, this[M].RowMap, inserting);
        console.assert(oldR === oldC);
        if (oldR) {
            super.delete(oldR);
        }
        super.add(inserting);
        return this;
    }
    *values() {
        for (let [_, v] of this.entries()) {
            yield v;
        }
    }
    valuesInRow(r, start, end) {
        let line = this[R].get(r);
        if (!line) {
            return EmptyIter;
        }
        return line.values(start, end);
    }
    valuesInCol(c, start, end) {
        let line = this[C].get(c);
        if (!line) {
            return EmptyIter;
        }
        return line.values(start, end);
    }

    [Symbol.iterator]() {
        return this.entries();
    }
    static get [Symbol.species]() {
        return this;
    }
}
const M = Symbol('MapClasses');
const R = Symbol('Rows');
const C = Symbol('Cols');

function deleteLine(primary, pKey, secondary) {
    let outer = primary.get(pkey);
    if (!outer) {
        return 0;
    }
    for (let [skey, odata] of outer) {
        let idata = destructiveDeref(secondary, skey, pkey);
        console.assert(odata === idata);
    }
    primary.delete(pkey);
    return outer;
}

function destructiveDeref(outer, first, second) {
    let inner = outer.get(first);
    if (!inner) {
        return undefined;
    }
    let inserted = inner.get(second);
    if (!inserted) {
        return undefined;
    }
    inner.delete(second);
    if (inner.size == 0) {
        outer.delete(first);
    }
    return inserted;
}

function insertInto(outer, first, second, secondCtor, inserting) {
    let inner = outer.get(first);
    if (!inner) {
        outer.set(first, inner = new secondCtor());
    }
    const alreadyHad = inner.get(second);
    inner.set(second, inserting);
    return alreadyHad;
}

function* iterateEntriesInLine(line, entries, start, end) {
    if (!line) {
        return;
    }
    for (let s of line.values(start, end)) {
        yield entries.get(s);
    }
}