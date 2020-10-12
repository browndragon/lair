import Phaser from 'phaser';
import { describe, test, expect } from '@jest/globals';

import PointMass from './pointMass';
import Spring from './spring';

describe('Spring forces', () => {
    test.each([
        [new Spring(1, 1), {x:0, y:0}, {x:-1, y:0},`{"x":0,"y":0}`],
        [new Spring(1, 10), {x:0, y:0}, {x:-1, y:0}, `{"x":0,"y":0}`],
        [new Spring(1, .1), {x:0, y:0}, {x:-1, y:0}, `{"x":0,"y":0}`],
        [new Spring(10, 1), {x:0, y:0}, {x:-1, y:0}, `{"x":9,"y":0}`],
        [new Spring(10, 10), {x:0, y:0}, {x:-1, y:0}, `{"x":90,"y":0}`],
        [new Spring(10, .1), {x:0, y:0}, {x:-1, y:0}, `{"x":0.9,"y":0}`],
        [new Spring(.1, 1), {x:0, y:0}, {x:-1, y:0}, `{"x":-0.9,"y":0}`],
        [new Spring(.1, 10), {x:0, y:0}, {x:-1, y:0}, `{"x":-9,"y":0}`],
        [new Spring(.1, .1), {x:0, y:0}, {x:-1, y:0},
            `{"x":-0.09000000000000001,"y":0}`
        ],
    ])('%# Spring(%p, %p, %p)=%p', (spring, a, b, e) => {
        const result = spring.force(new PointMass(a), new PointMass(b));
        expect(result).toBeInstanceOf(Phaser.Math.Vector2);
        // There's some weird behavior around jest matchers & `-0`, so this
        // bypasses that (... and double precision arithmetic...).
        expect(JSON.stringify(result)).toEqual(e);
    });   
});