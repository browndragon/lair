import Phaser from 'phaser';
import { describe, test, expect } from '@jest/globals';

import PointMass from './pointMass';

describe('PointMass', () => {
    test.each([
        [{x:3, y:3}, new Phaser.Math.Vector2(3, 3)],
        [{x:3, y:3, center:{x:1, y:1}}, new Phaser.Math.Vector2(1, 1)],
        [{x:3, y:3, body:{x:1, y:1}}, new Phaser.Math.Vector2(1, 1)],
        [{x:3, y:3, body:{x:1, y:1, center:{x:2, y:2}}}, new Phaser.Math.Vector2(2, 2)],
    ])('.position(%#,%p)=%p', (a, e) => {
        expect((new PointMass(a)).position).toEqual(e);
    });   

    test.each([
        [{x:0, y:0}, undefined],
        [{x:0, y:0, velocity:{x:1, y:1}}, undefined],
        [{x:0, y:0, body:{velocity:{x:1, y:1}}}, new Phaser.Math.Vector2(1, 1)],
    ])('.velocity(%#, %p)=%p', (a, e) => {
        expect((new PointMass(a)).velocity).toEqual(e);
    });
});
