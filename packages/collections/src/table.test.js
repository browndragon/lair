import { describe, test, expect } from '@jest/globals';
import Table from './table';

describe('Table', () => {
    test.each([
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
    ])('iteration %s', (nick, {init, rows, cols, entries=init}) => {
        const t = new Table(init);
        expect(t.size).toEqual(entries.length);
        expect(Array.from(t.rowKeys())).toEqual(rows);
        expect(Array.from(t.colKeys())).toEqual(cols);
        expect(Array.from(t.entries())).toEqual(entries);
    });
});