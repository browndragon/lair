import { describe, test, expect } from '@jest/globals';
import zip from './zip';

describe('Zip', () => {
    test.each([
        [ [], [] ],
        [ ['abc'], [['a'], ['b'], ['c']] ],
        [ ['abc', 'def'], [['a', 'd'], ['b', 'e'], ['c', 'f']] ],
        [ ['abc', 'de'], [['a', 'd'], ['b', 'e'], ['c', undefined]] ],
        [ ['abc', 'defg'], [['a', 'd'], ['b', 'e'], ['c', 'f']] ],
        [ ['abc', 'def', 'ghi'], [['a', 'd', 'g'], ['b', 'e', 'h'], ['c', 'f', 'i']] ],
    ])('zip(%p)==%p', (params, e) => {
        expect(zip(...params)).toEqual(e);
    });
})