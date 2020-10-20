import _Phaser from 'phaser';
import { describe, test, expect } from '@jest/globals';

import Damp from './damp';
import Anchor from '../anchor';

describe('Damp forces', () => {
    test.each([
        [
            1,
            {center:{x:0, y:0}, velocity:{x:0, y:0}},
            {center:{x:10, y:0}, velocity:{x:0, y:0}},
            `{"x":0,"y":0}`,
        ],
        [
            1,
            {center:{x:0, y:0}, velocity:{x:0, y:0}},
            {center:{x:10, y:0}, velocity:{x:-5, y:0}},
            `{"x":-2.5,"y":0}`,
        ],
        [
            0.25,
            {center:{x:0, y:0}, velocity:{x:0, y:0}},
            {center:{x:10, y:0}, velocity:{x:-5, y:0}},
            `{"x":-1,"y":0}`,
        ],
        [
            4,
            {center:{x:0, y:0}, velocity:{x:0, y:0}},
            {center:{x:10, y:0}, velocity:{x:-5, y:0}},
            `{"x":-4,"y":0}`, // ?!?!
        ],
    ])('%# Damp(%p, %j, %j)=%p', (damp, a, b, e) => {
        const pma = Anchor.ensure({body:a});
        const pmb = Anchor.ensure({body:b});
        let force = (new Damp(damp)).force(pma, pmb);
        expect(JSON.stringify(force)).toEqual(e);
    });   
});