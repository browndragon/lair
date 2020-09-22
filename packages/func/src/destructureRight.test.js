import { describe, test, expect } from '@jest/globals';
import destructureRight from './destructureRight';

describe('destructureRight', () => {
    expect('isAFunction').toEqual('isAFunction');
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
        'destructureRight(%p, %p) == %p',
        (array, want, e) => expect(destructureRight(array, want)).toEqual(e)
    );
})