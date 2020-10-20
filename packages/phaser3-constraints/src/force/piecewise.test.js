import _Phaser from 'phaser';
import { describe, test, expect } from '@jest/globals';

import Force from './fixed';
import Piecewise from './piecewise';
import Anchor from '../anchor';

class DebugForce extends Force {
    constructor(str) {
        super();
        this.str = str;
    }
    toString() { return this.str }
    force(_a, _b) {
        return this.str;
    }
}
const Near = new DebugForce('Near');
const Far = new DebugForce('Far');
const testing = new Piecewise(10, Near, Far);

describe('Limit forces', () => {
    test.each([
        [{x:0, y:0}, {x:5, y:0}, 'Near'],
        [{x:0, y:0}, {x:50, y:0}, 'Far'],
        [{x:0, y:0}, {x:-5, y:0}, 'Near'],
        [{x:0, y:0}, {x:-50, y:0}, 'Far'],
    ])('%# Limit(%p, %p)=%p', (a, b, e) => {
        expect(
            testing.force(new Anchor(a), new Anchor(b))
        ).toEqual(e);
    });   
});