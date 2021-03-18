import { jest, test, expect } from '@jest/globals';
import UV from './uv';

describe('tilemath', ()=>{
    let uv = new UV();
    test.each([
        [uv.u(0), -1],
        [uv.u(7), -1],
        [uv.u(9), 0],
        [uv.v(23), 0],
        [uv.v(25), 1],
        [uv.uv(23, 25), [0, 1]],

        [uv.x(0), 8],
        [uv.x(1), 24],
        [uv.y(2), 40],
        [uv.xy(3, 4), [56, 72]],
    ])('#%# %p is %p', (a, e) => expect(a).toEqual(e));
});