import { describe, test, expect } from '@jest/globals';
import MultiMap from './multiMap';
import SortedMap from './sortedMap';

describe('MultiMap', () => {
    test('Empty', () => {
        const m = new MultiMap();
        expect(m.size).toEqual(0);
        expect(Array.from(m.entries())).toEqual([]);
        expect(Array.from(m.keys())).toEqual([]);
        expect(Array.from(m.values())).toEqual([]);
    });

    test('One', () => {
        const m = new MultiMap();
        m.add('a', 1);
        expect(m.size).toEqual(1);
        expect(Array.from(m.entries())).toEqual([['a', 1]]);
        expect(Array.from(m.keys())).toEqual(['a']);
        expect(Array.from(m.values())).toEqual([1]);
    });

    test('Two (same keys)', () => {
        const m = new MultiMap();
        m.add('a', 1);
        m.add('a', 2);
        expect(m.size).toEqual(2);
        expect(Array.from(m.entries())).toEqual([['a', 1], ['a', 2]]);
        expect(Array.from(m.keys())).toEqual(['a']);
        expect(Array.from(m.values())).toEqual([1, 2]);
    });

    test('Two (different keys)', () => {
        const m = new MultiMap();
        m.add('a', 1);
        m.add('b', 2);
        expect(m.size).toEqual(2);
        expect(Array.from(m.entries())).toEqual([['a', 1], ['b', 2]]);
        expect(Array.from(m.keys())).toEqual(['a', 'b']);
        expect(Array.from(m.values())).toEqual([1, 2]);
    });

    test('Two (same keys & values!)', () => {
        const m = new MultiMap();
        m.add('a', 1);
        m.add('a', 1);
        expect(m.size).toEqual(1);
        expect(Array.from(m.entries())).toEqual([['a', 1]]);
        expect(Array.from(m.keys())).toEqual(['a']);
        expect(Array.from(m.values())).toEqual([1]);
    })

    test('Constructs', () => {
        const ENTRIES = [['b', 2], ['a', 1], ['a', 0]];
        const m = new MultiMap(ENTRIES);
        expect(m.size).toEqual(3);
        expect(Array.from(m.entries())).toEqual(ENTRIES);
        expect(Array.from(m.entries('b'))).toEqual([['b', 2]]);
        expect(Array.from(m.entries('a'))).toEqual([['a', 1], ['a', 0]]);

        expect(Array.from(m.keys())).toEqual(['b', 'a']);
        expect(Array.from(m.values())).toEqual([2, 1, 0]);
        expect(Array.from(m.values('b'))).toEqual([2]);
        expect(Array.from(m.values('a'))).toEqual([1, 0]);
    });

    test('get and value are the same', () => {
        const m = new MultiMap([['a', 1], ['b', 2], ['a', 3]]);
        expect(m.size).toEqual(3);
        expect(Array.from(m.entries('a'))).toEqual([['a', 1], ['a', 3]]);
        expect(Array.from(m.get('a'))).toEqual([1, 3]);
        expect(Array.from(m.values('a'))).toEqual([1, 3]);
    });

    test('has', () => {
        const m = new MultiMap([['a', 1], ['b', 2], ['a', 3]]);
        expect(m.has('a')).toBeTruthy();
        expect(m.has('a', 17)).toBeFalsy();
        expect(m.has('a', 1)).toBeTruthy();
        expect(m.has('b')).toBeTruthy();
        expect(m.has('c')).toBeFalsy();
    });

    test('Modifications', () => {
        const m = new MultiMap();
        m.add('a', 1);
        m.add('b', 2);
        m.add('b', 2.5);
        m.add('a', -3);
        m.add('c', 4);
        m.add('a', 0);

        expect(m.size).toEqual(6);
        expect(Array.from(m.entries())).toEqual([
            ['a', 1], ['b', 2], ['b', 2.5], ['a', -3], ['c', 4], ['a', 0]
        ]);
        expect(Array.from(m.keys())).toEqual(['a', 'b', 'c']);
        expect(Array.from(m.values())).toEqual([1, 2, 2.5, -3, 4, 0]);

        expect(Array.from(m.values('a'))).toEqual([1, -3, 0]);
        expect(Array.from(m.values('b'))).toEqual([2, 2.5]);
        expect(Array.from(m.values('c'))).toEqual([4]);

        m.delete('c', 17);
        expect(m.size).toEqual(6);

        m.delete('c', 4);
        expect(m.size).toEqual(5);
        expect(Array.from(m.keys())).toEqual(['a', 'b']);
        expect(Array.from(m.values())).toEqual([1, 2, 2.5, -3, 0]);

        m.delete('b');
        expect(m.size).toEqual(3);
        expect(Array.from(m.keys())).toEqual(['a']);
        expect(Array.from(m.values())).toEqual([1, -3, 0]);

        m.add('b', 7);
        expect(m.size).toEqual(4);
        expect(Array.from(m.keys())).toEqual(['a', 'b']);
        expect(Array.from(m.values())).toEqual([1, -3, 0, 7]);

        m.delete('a', -3);
        expect(m.size).toEqual(3);
        expect(Array.from(m.keys())).toEqual(['a', 'b']);
        expect(Array.from(m.values())).toEqual([1, 0, 7]);
        expect(Array.from(m.values('a'))).toEqual([1, 0]);

        m.delete('b', 7);
        expect(m.size).toEqual(2);
        expect(Array.from(m.keys())).toEqual(['a']);
        expect(Array.from(m.values())).toEqual([1, 0]);
        expect(Array.from(m.values('a'))).toEqual([1, 0]);
        expect(Array.from(m.values('b'))).toEqual([]);
    });

    test('Sorts', () => {
        const m = new MultiMap(
            undefined, 
            SortedMap.comparing((a, b) => a < b ? -1 : a > b ? +1 : 0),
            SortedMap.comparing((a, b) => a < b ? +1 : a > b ? -1 : 0),
        );
        m.add('c', 0);
        m.add('b', -2);
        m.add('b', 2);
        m.add('a', -3);
        m.add('a', -1);
        m.add('a', 3);
        m.add('a', 1);
        m.add('c', -4);
        m.add('c', -5);
        m.add('c', 4);
        m.add('c', 5);
        m.add('d', 0);
        expect(m.size).toEqual(12);
        // Because nothing changes this object's own iteration order:
        expect(Array.from(m.values())).toEqual([0, -2, 2, -3, -1, 3, 1, -4, -5, 4, 5, 0]);
        // Because the key map is reverse order:
        expect(Array.from(m.keys())).toEqual(['d', 'c', 'b', 'a']);
        // Because the value map is forward order:
        expect(Array.from(m.values('a'))).toEqual([-3, -1, 1, 3]);
        expect(Array.from(m.values('c'))).toEqual([-5, -4, 0, 4, 5]);
    });
});