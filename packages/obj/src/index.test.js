import { describe, test, expect } from '@jest/globals';
import Obj from '.';

describe('Obj Bools', () => {
    test.each([
        [{}, false],
        [{a:1}, false],
        [new Map(), true],
        [new Map().set('a', 1), true],
        [new Set().add('a'), false],
        [new WeakMap(), false],
        [new Date(), false],
    ])('isMap(%p)==%p', (d, e) => expect(Obj.isMap(d)).toEqual(e));
    test.each([
        [{}, false],
        [{a:1}, false],
        [new Map(), true],
        [new Map().set('a', 1), true],
        [new Set().add('a'), true],
        [new WeakMap(), false],
        [new Date(), false],
    ])('isCollection(%p)==%p', (d, e) => expect(Obj.isCollection(d)).toEqual(e));
    test.each([
        [{}, true],
        [{a:1}, true],
        [new Map(), false],
        [new Map().set('a', 1), false],
        [new Set().add('a'), false],
        [new WeakMap(), false],
        [new Date(), false],
    ])('isLiteral(%p)==%p', (d, e) => expect(Obj.isLiteral(d)).toEqual(e));
    test.each([
        [{}, true],
        [{a:1}, false],
        [new Map(), false],
        [new Map().set('a', 1), false],
        [new Set().add('a'), false],
        [new WeakMap(), false],
        [new Date(), false],
    ])('isEmptyLiteral(%p)==%p', (d, e) => expect(Obj.isEmptyLiteral(d)).toEqual(e));
});

describe('Obj as Collection', () => {
    test.each([
        [{}, {}],
        [{a:1}, {a:1}],
        [new Map(), {}],
        [new Map().set('a', 1), {a:1}],
        [new Set().add('a'), undefined],
        [new WeakMap(), undefined],
        [new Date(), {}],
    ])('literal(%p)==%p', (d, e) => expect(Obj.literal(d)).toEqual(e));
    test.each([
        [{}, []],
        [{a:1}, [['a', 1]] ],
        [new Map(), [] ],
        [new Map().set('a', 1), [['a', 1]] ],
        [new Set().add('a'), [['a', 'a']] ],
        [new WeakMap(), undefined],
        [new Date(), [] ],
    ])('entries(%p)==%p', (d, e) => expect(Obj.entries(d)).toEqual(e));
    test.each([
        [{}, [] ],
        [{a:1}, ['a'] ],
        [new Map(), [] ],
        [new Map().set('a', 1), ['a'] ],
        [new Set().add('a'), ['a'] ],
        [new WeakMap(), undefined],
        [new Date(), [] ],
    ])('keys(%p)==%p', (d, e) => expect(Obj.keys(d)).toEqual(e));
});

describe('Obj CRUD', () => {
    test.each([
        [{}, undefined, undefined],
        [{}, 'a', undefined],
        [{a:1}, 'a', 1],
        [{b:1}, 'a', undefined],
    ])('get(%p, %p)==%p', (d, k, e) => expect(Obj.get(d, k)).toEqual(e));
    test.each([
        [{}, undefined, undefined, undefined, {}],
        [{}, 'a', undefined, undefined, {}],
        [{}, 'a', 1, 1, {a:1}],
        [{a:1}, 'a', 1, 1, {a:1}],
        [{a:2}, 'a', 1, 1, {a:1}],
        [{a:{b:1}}, 'a', 1, 1, {a:1}],
        [{a:1}, 'a', {b:2}, {b:2}, {a:1}],
        [{b:1}, 'a', undefined, undefined, {b:1}],
        [{b:1}, 'a', 1, 1, {a:1, b:1}],
    ])('set(%p, %p, %p)==%p', (d, k, v, e, s) => {
        d = {...d};
        expect(Obj.set(d, k, v)).toEqual(e);
        expect(d).toEqual(s);
    });
    test.each([
        [{}, undefined, undefined, {}],
        [{}, 'a', undefined, {}],
        [{}, 'a', undefined, {}],
        [{a:1}, 'a', 1, {}],
        [{a:2}, 'a', 2, {}],
        [{a:{b:1}}, 'a', {b:1}, {}],
        [{a:1, b:1}, 'a', {b:1}],
        [{b:1}, 'a', undefined, {b:1}],
    ])('delete(%p, %p)==%p', (d, k, e, s) => {
        d = {...d};
        expect(Obj.delete(d, k)).toEqual(e);
        expect(d).toEqual(s);
    });
    test.each([
        [{}, undefined, undefined, undefined, {}],
        [{}, 'a', undefined, undefined, {}],
        [{}, 'a', 1, 1, {a:1}],
        [{a:1}, 'a', 1, 1, {a:1}],
        [{a:2}, 'a', 1, 1, {a:1}],
        [{a:{b:1}}, 'a', 1, 1, {a:1}],
        [{a:1}, 'a', {b:2}, {b:2}, {a:1}],
        [{b:1}, 'a', undefined, undefined, {b:1}],
        [{b:1}, 'a', 1, 1, {a:1, b:1}],
    ])('overwrite(%p, %p, %p)==%p', (d, k, v, e, s) => {
        d = {...d};
        expect(Obj.overwrite(d, k, v)).toEqual(e);
        expect(d).toEqual(s);
    });
    test.each([
        [{}, undefined, undefined, undefined, {}],
        [{}, 'a', undefined, undefined, {}],
        [{}, 'a', 1, 1, {a:1}],
        [{a:1}, 'a', 1, 1, {a:1}],
        [{a:2}, 'a', 1, 1, {a:1}],
        [{a:{b:1}}, 'a', 1, 1, {a:1}],
        [{a:1}, 'a', {b:2}, {b:2}, {a:1}],
        [{b:1}, 'a', undefined, undefined, {b:1}],
        [{b:1}, 'a', 1, 1, {a:1, b:1}],
    ])('underwrite(%p, %p, %p)==%p', (d, k, v, e, s) => {
        d = {...d};
        expect(Obj.underwrite(d, k, v)).toEqual(e);
        expect(d).toEqual(s);
    });
});

describe('Map CRUD', () => {
    test.each([
        [new Map(), undefined, undefined],
        [new Map(), 'a', undefined],
        [new Map().set('a', 1), 'a', 1],
        [new Map().set('b', 1), 'a', undefined],
    ])('get(%p)==%p', (d, k, e) => expect(Obj.get(d, k)).toEqual(e));
    test.each([
        [new Map(), undefined, undefined, undefined, {}],
        [new Map(), 'a', undefined, undefined, {}],
        [new Map(), 'a', 1, 1, {a:1}],
        [new Map([['a', 1]]), 'a', 1, 1, {a:1}],
        [new Map([['a', 2]]), 'a', 1, 1, {a:1}],
        [new Map([['a', new Map([['b', 1]])]]), 'a', 1, 1, {a:1}],
        [new Map([['a', 1]]), 'a', {b:2}, {b:2}, {a:1}],
        [new Map([['b', 1]]), 'a', undefined, undefined, {b:1}],
        [new Map([['b', 1]]), 'a', 1, 1, {a:1, b:1}],
    ])('set(%p, %p, %p)==%p', (d, k, v, e, s) => {
        d = {...d};
        expect(Obj.set(d, k, v)).toEqual(e);
        expect(Object.fromEntries(d)).toEqual(s);
    });
    test.each([
        [new Map(), undefined, undefined, {}],
        [new Map(), 'a', undefined, {}],
        [new Map(), 'a', undefined, {}],
        [new Map([['a',1]]), 'a', 1, {}],
        [new Map([['a',2]]), 'a', 2, {}],
        [new Map([['a', new Map([['b', 2]])]]), 'a', {b:1}, {}],
        [new Map([['a', 1], ['b', 1]]), 'a', {b:1}],
        [new Map([['b', 1]]), 'a', undefined, {b:1}],
    ])('delete(%p, %p)==%p', (d, k, e, s) => {
        d = {...d};
        expect(Obj.delete(d, k)).toEqual(e);
        expect(d).toEqual(s);
    });
});