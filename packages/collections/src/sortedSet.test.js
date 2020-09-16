import { describe, test, expect } from '@jest/globals';
import SortedSet from './sortedSet';

describe('SortedSet', () => {
    test('empty', () => {
        let s = new SortedSet();
        expect(s.size).toEqual(0);
        expect(Array.from(s.entries())).toEqual([]);
        expect(Array.from(s.values())).toEqual([]);
    });
    test('one', () => {
        let s = new SortedSet();
        s.add('a');
        expect(s.size).toEqual(1);
        expect(Array.from(s.entries())).toEqual([['a', 'a']]);
        expect(Array.from(s.values())).toEqual(['a']);
    });
    test.each([
        ['forward', 'a', 'b'],
        ['backward', 'b', 'a'],
        ['overwrite1', 'b', 'a', 'b'],
        ['overwrite2', 'a', 'b', 'a'],
    ])('two (%p)', (name, ...params) => {
        let s = new SortedSet();
        for (let param of params) {
            s.add(param);
        }
        expect(s.size).toEqual(2);
        expect(Array.from(s.entries())).toEqual([['a', 'a'], ['b', 'b']]);
        expect(Array.from(s.values())).toEqual(['a', 'b']);
    });
    describe('rangeQuery', () => {
        const entry = (k) => [k, k];
        test('entry', () => {
            expect(entry('b')).toEqual(['b', 'b']);
        })        
        const m = new SortedSet(['c', 'b', 'e', 'a', 'd']);
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
        ])('restrict(%p, %p)=%p', (start, end, values) => {
            expect(Array.from(m.entries(start, end))).toEqual(values.map(entry));
            expect(Array.from(m.values(start, end))).toEqual(values);
        });
    });
    test('comparingLength', () => {
        const m = new (SortedSet.comparing((a, b) => b.length - a.length))([
            'vwxyz',
            'a',
            'bc',
            'def',
            'ghij',
            'klmno',
            'pqrstu',
        ]);
        expect(m.size).toEqual(7);
        expect(Array.from(m.values()).length).toEqual(7);
        expect(Array.from(m.values())).toEqual([
            'pqrstu',
            'vwxyz',
            'klmno',
            'ghij',
            'def',
            'bc',
            'a',
        ]);
    });
});
