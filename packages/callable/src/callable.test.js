import { describe, test, expect } from '@jest/globals';
import Callable from './callable';

describe('Callable', () => {
    test('direct', () => {
        let called = [];
        const c = new Callable((...params) => {
            called.push(params);
            return called.length;
        });
        expect(c()).toEqual(1);
        expect(c(1)).toEqual(2);
        expect(c(2, 3)).toEqual(3);
        expect(called).toEqual([
            [],
            [1],
            [2, 3],
        ]);
    });
    test('.call', () => {
        let called = [];
        const c = new Callable((...params) => {
            called.push(params);
            return called.length;
        });
        expect(c.call()).toEqual(1);
        expect(c.call(undefined, 1)).toEqual(2);
        expect(c.call(undefined, 2, 3)).toEqual(3);
        expect(called).toEqual([
            [],
            [1],
            [2, 3],
        ]);
    });
    test('.bind', () => {
        let called = [];
        const c = new Callable((...params) => {
            called.push(params);
            return called.length;
        });
        expect(c.bind()()).toEqual(1);
        expect(c.bind(undefined, 1)()).toEqual(2);
        expect(c.bind(undefined, 2, 3)()).toEqual(3);
        expect(called).toEqual([
            [],
            [1],
            [2, 3],
        ]);
    });
    test('dynamicallyNamed', () => {
        let name = 'somename';
        // A fancy construction just to prove we *can* dynamically name these otherwise anonymous guys.
        // It can sort of be provided as an exposed function, but it's not super helpful to do so imo; you end up nesting functions dramatically. Ew.
        let callable = new Callable({[name]: () => 17}[name]);
        expect(callable.name).toEqual(name);
        expect(callable()).toEqual(17);
    });
})