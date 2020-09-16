import { describe, test, expect } from '@jest/globals';
import SortedMap from './sortedMap';

describe('SortedMap', () => {
    test('empty', () => {
        let m = new SortedMap();
        expect(m.size).toEqual(0);
        expect(Array.from(m.entries())).toEqual([]);
        expect(Array.from(m.keys())).toEqual([]);
        expect(Array.from(m.values())).toEqual([]);
    });
    test('one', () => {
        let m = new SortedMap();
        m.set('a', 1);
        expect(m.size).toEqual(1);
        expect(Array.from(m.entries())).toEqual([['a', 1]]);
        expect(Array.from(m.keys())).toEqual(['a']);
        expect(Array.from(m.values())).toEqual([1]);
    });
    test.each([
        ['forward', ['a', 1], ['b', 2]],
        ['backward', ['b', 2], ['a', 1]],
        ['overwritten', ['a', 3], ['b', 2], ['a', 1]],
    ])('two (%p)', (name, ...params) => {
        let m = new SortedMap();
        for (let param of params) {
            m.set(...param);
        }
        expect(m.size).toEqual(2);
        expect(Array.from(m.entries())).toEqual([['a', 1], ['b', 2]]);
        expect(Array.from(m.keys())).toEqual(['a', 'b']);
        expect(Array.from(m.values())).toEqual([1, 2]);
    });
    describe('rangeQuery', () => {
        let _values = {
            c: 1,
            b: 2,
            e: 3,
            a: 4,
            d: 5,
        }
        const value = (k) => _values[k];
        test('value', () => {
            expect(value('b')).toEqual(2);
        })
        const entry = (k) => [k, value(k)];
        test('entry', () => {
            expect(entry('b')).toEqual(['b', 2]);
        })        
        const m = new SortedMap(['c', 'b', 'e', 'a', 'd'].map(entry));
        test.each([
            [undefined, undefined, ['a', 'b', 'c', 'd', 'e']],
            ['b', undefined, ['b', 'c', 'd', 'e']],
            ['ba', undefined, ['c', 'd', 'e']],
            ['az', undefined, ['b', 'c', 'd', 'e']],
            [undefined, 'f', ['a', 'b', 'c', 'd', 'e']],
            [undefined, 'e', ['a', 'b', 'c', 'd']],
            [undefined, 'da', ['a', 'b', 'c', 'd']],
            ['b', 'e', ['b', 'c', 'd']],
            ['az', 'dz', ['b', 'c', 'd']],
        ])('restrict(%p, %p)=%p', (start, end, keys) => {
            expect(Array.from(m.keys(start, end))).toEqual(keys);
            expect(Array.from(m.entries(start, end))).toEqual(keys.map(entry));
            expect(Array.from(m.values(start, end))).toEqual(keys.map(value));
        });
    });
});
