import { jest, test, expect } from '@jest/globals';
import Sparse from './sparse';

test('dataOperations', () => {
    let s = new Sparse();
    for (let i = 0; i < 25; ++i) {
        expect(
            s.set(String.fromCharCode(65+i), Math.floor(i / 5), i % 5)
        ).toEqual(s);
    }
    expect(s.size).toEqual(25);
    expect(s.get(2, 3)).toEqual('N');
    expect(s.get(3, 2)).toEqual('R');
    expect([...s.values()].join('')).toEqual('ABCDEFGHIJKLMNOPQRSTUVWXY');
    // Let's substitute Z for "J" which isn't a real letter.
    // J was i=9, so:
    expect(s.swap("Z", 1, 4)).toEqual("J");
    expect(s.get(1, 4)).toEqual("Z");
    // You know, Y is overrated.
    expect(s.has(4, 4)).toBeTruthy();
    expect(s.pop(4, 4)).toEqual("Y");
    expect(s.has(4, 4)).toBeFalsy();
});
