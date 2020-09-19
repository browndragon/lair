import { describe, test, expect } from '@jest/globals';
import Table from './table';

describe.each([
    ['empty', {
        init: [],
        rows: [],
        cols: [],
    }],
    ['one', {
        init: [[['a', 'b'], 1]],
        rows: ['a'],
        cols: ['b'],
    }],
    ['two rows', {
        init: [[['a', 'b'], 1], [['c', 'b'], 1]],
        rows: ['a', 'c'],
        cols: ['b'],
    }],
    ['two cols', {
        init: [[['a', 'b'], 1], [['a', 'c'], 1]],
        rows: ['a'],
        cols: ['b', 'c'],
    }],
    ['four cells', {
        init: [[['a', 'b'], 1], [['c', 'd'], 1]],
        rows: ['a', 'c'],
        cols: ['b', 'd'],
    }],
    ['four cells reorder', {
        init: [[['c', 'd'], 1], [['a', 'b'], 1]],
        rows: ['a', 'c'],
        cols: ['b', 'd'],
        entries: [[['c', 'd'], 1], [['a', 'b'], 1]],
    }],
    ['overwrite', {
        init: [[['a', 'b'], 10], [['a', 'b'], 1]],
        rows: ['a'],
        cols: ['b'],
        entries: [[['a', 'b'], 1]],
    }],
])('Table %s', (nick, {init, rows, cols, entries=init}) => {
    const t = new Table(init);
    test('size', () => expect(t.size).toEqual(entries.length));
    test('rowKeys', () => expect(Array.from(t.rowKeys())).toEqual(rows));
    test('colKeys', () => expect(Array.from(t.colKeys())).toEqual(cols));
    test('entries', () => expect(Array.from(t.entries())).toEqual(entries));
    test('forEach', () => {
        let calls = [];
        t.forEach((...params) => calls.push(params));
        expect(calls.length).toEqual(entries.length);
        expect(calls).toEqual(entries.map(([[r, c], v]) => [v, [r, c], t]));
    });
});


describe.each([
    ['Rows', (t) => ({            
        entriesIn(...params) { return t.entriesInRow(...params); },
        forEachIn(...params) { return t.forEachInRow(...params); },
        keysIn(...params) { return t.keysInRow(...params); },
        otherKeysIn(...params) { return t.colsInRow(...params); },
        valuesIn(...params) { return t.valuesInRow(...params); },
        otherKeysOf([[r, c], v]) { return c; },
        data(rows, cols) { return rows; },
        t
    })],
    ['Cols', (t) => ({
        entriesIn(...params) { return t.entriesInCol(...params); },
        forEachIn(...params) { return t.forEachInCol(...params); },
        keysIn(...params) { return t.keysInCol(...params); },
        otherKeysIn(...params) { return t.rowsInCol(...params); },
        valuesIn(...params) { return t.valuesInCol(...params); },
        otherKeysOf([[r, c], v]) { return r; },
        data(rows, cols) { return cols; },
        t
    })],
])('Linetype %s', (nick, m) => {
    describe.each([
        ['empty', {
            init: [],
            rows: {},
            cols: {},
        }],
        ['one', {
            init: [[['a', 'b'], 'c']],
            rows: {
                a: [[['a', 'b'], 'c']],
            },
            cols: {
                b: [[['a', 'b'], 'c']],
            }
        }]
    ])('Entries %s', (nick, {init, rows, cols}) => {
        const t = m(new Table(init));
        const queries = {...t.data(rows, cols), z: []};
        for (let [q, vs] of Object.entries(queries)) {
            expect(typeof(q)).toBe('string');
            expect(Array.isArray(vs)).toBeTruthy();
            test(`entriesIn ${q}`, () => expect(Array.from(t.entriesIn(q))).toEqual(vs));
            test(`forEachIn ${q}`, () => {
                let calls = [];
                expect(t.forEachIn(q, (...params) => calls.push(params)));
                expect(calls).toEqual(vs.map(([[r, c], v]) => [v, [r, c], t.t]));
            });
            test(`keysIn ${q}`, () => expect(
                Array.from(t.keysIn(q))
            ).toEqual(
                vs.map(([[r, c], v]) => [r, c])
            ));
            test(`otherKeysIn ${q}`, () => expect(
                Array.from(t.otherKeysIn(q))
            ).toEqual(
                vs.map(t.otherKeysOf)
            ));
            test(`valuesIn ${q}`, () => expect(
                Array.from(t.valuesIn(q))
            ).toEqual(
                vs.map(([[r, c], v]) => v)
            ));
        }
    });
});
