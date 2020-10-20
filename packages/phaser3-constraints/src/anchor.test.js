import Phaser from 'phaser';
import { describe, test, expect } from '@jest/globals';

import Anchor from './anchor';

describe('Anchor', () => {
    test.each([
        [{x:3, y:3}, new Phaser.Math.Vector2(3, 3)],
        [{x:3, y:3, center:{x:1, y:1}}, new Phaser.Math.Vector2(1, 1)],
        [{x:3, y:3, body:{x:1, y:1}}, new Phaser.Math.Vector2(1, 1)],
        [{x:3, y:3, body:{x:1, y:1, center:{x:2, y:2}}}, new Phaser.Math.Vector2(2, 2)],
    ])('.position(%#,%p)=%p', (a, e) => {
        expect((new Anchor(a)).position).toEqual(e);
    });   

    test.each([
        [{x:0, y:0}, undefined],
        [{x:0, y:0, velocity:{x:1, y:1}}, new Phaser.Math.Vector2(1, 1)],
        [{x:0, y:0, body:{velocity:{x:1, y:1}}}, new Phaser.Math.Vector2(1, 1)],
    ])('.velocity(%#, %p)=%p', (a, e) => {
        expect((new Anchor(a)).velocity).toEqual(e);
    });
});

describe('Projection', () => {
    test.each([
        [
            {center:{x:0, y:0}, velocity:{x:0, y:0}},
            {center:{x:10, y:0}, velocity:{x:0, y:0}},
            `{"x":0,"y":0}`
        ],
        [
            {center:{x:0, y:0}, velocity:{x:+2, y:0}},
            {center:{x:10, y:0}, velocity:{x:0, y:0}},
           `{"x":2,"y":0}`
        ],
        [
            {center:{x:0, y:0}, velocity:{x:0, y:0}},
            {center:{x:10, y:0}, velocity:{x:+2, y:0}},
           `{"x":-2,"y":0}`
        ],
        [
            {center:{x:0, y:0}, velocity:{x:+1, y:0}},
            {center:{x:10, y:0}, velocity:{x:-1, y:0}},
           `{"x":2,"y":0}`
        ],
        [
            {center:{x:0, y:0}, velocity:{x:-1, y:0}},
            {center:{x:10, y:0}, velocity:{x:+1, y:0}},
           `{"x":-2,"y":0}`
        ],
        [
            {center:{x:3, y:0}, velocity:{x:-3, y:+4}},
            {center:{x:0, y:4}, velocity:{x:0, y:0}},
           `{"x":-3.0000000000000004,"y":4}`,
        ],
        [
            {center:{x:3, y:0}, velocity:{x:0, y:0}},
            {center:{x:0, y:4}, velocity:{x:+3, y:-4}},
           `{"x":-3.0000000000000004,"y":4}`,
        ],
        [
            {center:{x:0, y:0}, velocity:{
                x:Math.cos(Math.PI/3), y:Math.cos(Math.PI/3)
            }},
            {center:{x:1, y:0}, velocity:{x:0, y:0}},
           `{"x":0.5000000000000001,"y":0}`,
        ],
    ])('%# Projection(%j, %j)==%p', (a, b, e) => {
        expect(JSON.stringify(
            Anchor.project(...Anchor.ensure(a).relative(b))
        )).toEqual(e);
    });
});