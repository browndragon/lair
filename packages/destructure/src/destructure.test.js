import { describe, test, expect } from '@jest/globals';
import destructure from './destructure';

describe('destructureRight', () => {
    test.each([
        [ [], undefined, [[]] ],
        [ [], 1, [[]] ],
        [ [], 2, [[]] ],
        [ [1], undefined, [[], 1] ],
        [ [1], 1, [[], 1] ],
        [ [1], 2, [[], 1] ],
        [ [1, 2], undefined, [[1], 2] ],
        [ [1, 2], 1, [[1], 2] ],
        [ [1, 2], 2, [[], 1, 2] ],
        [ [1, 2, 3], 1, [[1, 2], 3] ],
        [ [1, 2, 3], 2, [[1], 2, 3] ],
        [ [1, 2, 3], 3, [[], 1, 2, 3] ],
    ])(
        'destructure(%p, %p) == %p',
        (array, want, e) => expect(destructure(array, want)).toEqual(e)
    );
})

describe('destructureBoth', () => {
    test.each([
        [0, [1, 2, 3], 0, [[1, 2, 3]]],
        [1, [1, 2, 3], 0, [1, [2, 3]]],
        [0, [1, 2, 3], 1, [[1, 2], 3]],
        [1, [1, 2, 3], 1, [1, [2], 3]],
        [2, [1, 2, 3], 0, [1, 2, [3]]],
        [0, [1, 2, 3], 2, [[1], 2, 3]],
        [2, [1, 2, 3], 2, [1, undefined, [], 2, 3]],
    ])(
        'destructure(left=%p, array=%p, right=%p) == %p',
        (left, array, right, e) => expect(destructure(array, right, left)).toEqual(e)
    );
})