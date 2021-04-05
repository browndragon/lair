import {describe, expect, test} from '@jest/globals';
import Phaser from 'phaser';

import Spring from './spring';

function spring(k, d, l, a, b, aO, bO) {
    return (new Spring()).setKDL(k, d, l).setA(Body.with(a), aO).setB(Body.with(b), bO);
}

class Body {
    constructor(
        width=32, height=32,
        mass=1,
        position, 
        velocity,
    ) {
        this.width = width;
        this.height = height;
        this.mass = mass;
        this.position = new Phaser.Math.Vector2(position);
        this.velocity = new Phaser.Math.Vector2(velocity);
    }
    get x() { return this.position.x }
    set x(v) { this.position.x = v }
    get y() { return this.position.y }
    set y(v) { this.position.y = v }
    static with({width, height, mass, position, velocity, ...params}) {
        return {
            body: new Body(width, height, mass, position, velocity),
            ...params
        };
    }
}

describe('SpringHelpers', () => {
    let s = spring(.1, .01, 0, {}, {});
    test('spring', () => {
        expect(s.k).toEqual(.1);
        expect(s.d).toEqual(.01);
        expect(s.l).toEqual(0);
    });
    test.each([s.a.body, s.b.body])('body %p', body => {
        expect(body.x).toEqual(0);
        expect(body.y).toEqual(0);
        expect(body.mass).toEqual(1);
        expect(body.position).toEqual(Phaser.Math.Vector2.ZERO);
        expect(body.velocity).toEqual(Phaser.Math.Vector2.ZERO);
    });
});

describe('OverlapAtRest', () => {
    // Spring length 0, but they're both at 0 also.
    let s = spring(.1, .01, 0, {}, {});
    s.apply(1000);
    test.each([s.a.body, s.b.body])('body %p', body => {
        expect(body.x).toEqual(0);
        expect(body.y).toEqual(0);
        expect(body.mass).toEqual(1);
        expect(body.position).toEqual(Phaser.Math.Vector2.ZERO);
        expect(body.velocity).toEqual(Phaser.Math.Vector2.ZERO);
    });
});

describe('ApartAtRest', () => {
    // As far apart as the spring length.
    let s = spring(.1, .01, 1000, {}, {position:{x:1000, y:0}});
    s.apply(1000);
    test.each([
        ['a', s.a.body],
        ['b', s.b.body],
    ])('%s', (title, body) => {
        expect(body.velocity).toEqual({x:0, y:0});
    });
});

describe('Damping', () => {
    // This is a spring that wants to be 1K long; though the two ends *are* 1K apart, the left is moving to the right. This compresses the spring, slowing the left by 10 and speeding the right by 10.
    describe.each([
        ['InitialTick', {
            a: {position:{x:-50, y:0}, velocity:{x:0, y:0}},
            b: {position:{x:1050, y:0}, velocity:{x:0, y:0}},
            eav: {x:5, y:0},
            ebv: {x:-5, y:0},
        }],
        ['SecondTick', {
            a: {position:{x:-45, y:0}, velocity:{x:5, y:0}},
            b: {position:{x:1045, y:0}, velocity:{x:-5, y:0}},
            eav: {x:9.45, y:0},
            ebv: {x:-9.45, y:0},
        }],
        ['ProveSymmetric', {
            b: {position:{x:-45, y:0}, velocity:{x:5, y:0}},
            a: {position:{x:1045, y:0}, velocity:{x:-5, y:0}},
            ebv: {x:9.45, y:0},
            eav: {x:-9.45, y:0},
        }],
        ['JustDampNoDisplacement', {
            a: {position:{x:0, y:0}, velocity:{x:1000, y:0}},
            b: {position:{x:1000, y:0}, velocity:{x:0, y:0}},
            eav:{x:1005, y:0},
            ebv:{x:5, y:0},
        }],
        ['StretchDamp', {
            a: {position:{x:0, y:0}, velocity:{x:-1000, y:0}},
            b: {position:{x:1000, y:0}, velocity:{x:0, y:0}},
            eav:{x:-995, y:0},
            ebv:{x:-5, y:0},
        }],
        ['StretchDampSecondTick2', {
            a: {position:{x:0, y:0}, velocity:{x:-995, y:0}},
            b: {position:{x:1000, y:0}, velocity:{x:-5, y:0}},
            eav:{x:-990.05, y:0},
            ebv:{x:-9.95, y:0},
        }],
    ])('%s', (title, {a, b, eav, ebv}) => {
        let s = spring(
            .1, .01, 1000,
            a,
            b,
        );
        s.apply(1000);
        test.each([
            ['a', s.a.body, eav],
            ['b', s.b.body, ebv],
        ])('%s', (title, body, velocity) => {
            expect(body.velocity).toEqual(velocity);
        });
    });
});
