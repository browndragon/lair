import { describe, test, expect } from '@jest/globals';
import {DEFAULT_COMPARATOR} from './sorting';

describe('Sorting', () => {
    describe('DefaultComparator', () => {
        test.each([
            [1, 2, -1],
            [2, 2, 0],
            [3, 2, +1],
            [2, 1, +1],
            [2, 2, 0],
            [2, 3, -1],
            [1, "2", -1],
            [2, "2", 0],
            [3, "2", +1],
            ["2", 1, +1],
            ["2", 2, 0],
            ["2", 3, -1],
            ['a', 'a', 0],
            ['a', 'b', -1],
            ['b', 'a', +1],
            [12, 100, -1],
            ["12", 100, -1],
            [12, "100", -1],
            ["12", "100", +1],
        ])('Compare(%p, %p) == %p', (a, b, e) => {
            expect(DEFAULT_COMPARATOR([a], [b])).toEqual(e);
        })
    });
});