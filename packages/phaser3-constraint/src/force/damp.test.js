import Phaser from 'phaser';
import { describe, test, expect } from '@jest/globals';

import Damp from './damp';
import PointMass from './pointMass';

const DebugForce = {
    toString() {
        return 'Position 1:1';
    },
    force(a, b) {
        return new Phaser.Math.Vector2(
            b.position.x - a.position.x,
            b.position.y - a.position.y
        );
    },
};
describe('Damp forces', () => {
    test.each([
        {x:10, y:0},
        {body:{x:10, y:0}},
        {body:{center:{x:10, y:0}}},
        {body:{position:{x:10, y:0}}},
    ])('%# DebugForce(%p)', (a) => {
        expect(DebugForce.force(
            new PointMass({x:0, y:0}),
            new PointMass(a),
        )).toEqual(
            new Phaser.Math.Vector2(10, 0)
        );
    });

    test.each([
        [
            1,
            {center:{x:0, y:0}, velocity:{x:0, y:0}},
            {center:{x:10, y:0}, velocity:{x:0, y:0}},
            {x:0, y:0},
        ],
        [
            1,
            {center:{x:0, y:0}, velocity:{x:0, y:0}},
            {center:{x:10, y:0}, velocity:{x:-5, y:0}},
            {x:-5, y:0},
        ],
        [
            0.2,
            {center:{x:0, y:0}, velocity:{x:0, y:0}},
            {center:{x:10, y:0}, velocity:{x:-5, y:0}},
            {x:-1, y:0},
        ],
        [
            1.5,
            {center:{x:0, y:0}, velocity:{x:0, y:0}},
            {center:{x:10, y:0}, velocity:{x:-5, y:0}},
            {x:-7.5, y:0}, // ?!?!
        ],
    ])('%# Damp(%p, %p, %p)=%p', (damp, a, b, e) => {
        const pma = new PointMass({body:a});
        const pmb = new PointMass({body:b});
        let basicForce = DebugForce.force(pma, pmb);
        let actualForce = (new Damp(damp, DebugForce)).force(pma, pmb);
        expect(actualForce).not.toBeUndefined();
        expect(basicForce).not.toBeUndefined();
        expect(
            actualForce.subtract(basicForce)
        ).toEqual(
            new Phaser.Math.Vector2(e)
        );
    });   
});