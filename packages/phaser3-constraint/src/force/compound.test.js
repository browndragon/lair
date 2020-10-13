import Phaser from 'phaser';
import { describe, test, expect } from '@jest/globals';

import Compound from './compound';
import Force from './force';
import PointMass from './pointMass';

class DebugForce extends Force {
    constructor(str) {
        super();
        this.str = str;
    }
    toString() { return this.str }
    force(a, b) {
        return this.str;
    }
}
const Near = new DebugForce('Near');
const Far = new DebugForce('Far');
const compound = new Compound(10, Near, Far);

describe('Limit forces', () => {
    test.each([
        [{x:0, y:0}, {x:5, y:0}, 'Near'],
        [{x:0, y:0}, {x:50, y:0}, 'Far'],
        [{x:0, y:0}, {x:-5, y:0}, 'Near'],
        [{x:0, y:0}, {x:-50, y:0}, 'Far'],
    ])('%# Limit(%p, %p)=%p', (a, b, e) => {
        expect(
            compound.force(new PointMass(a), new PointMass(b))
        ).toEqual(e);
    });   
});