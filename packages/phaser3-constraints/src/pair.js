// import Phaser from 'phaser';
import P3P from '@browndragon/phaser3-plugin';
import Anchor from './anchor';

/** Constrains two bodies A & B by modeling them as point masses connected by the given force. */
export default class Pair extends P3P.Managed {
    constructor(parent, a, b, force) {
        super(parent);
        this.a = Anchor.ensure(a);
        this.b = Anchor.ensure(b);
        this.force = force;
        this.lastA = undefined;
        this.lastB = undefined;
    }

    update(elapsed, delta) {
        const a = this.a.object;
        const b = this.b.object;
        if (this.lastA) {
            a.body.acceleration.subtract(this.lastA);
            this.lastA = undefined;
        }
        if (this.lastB) {
            b.body.acceleration.subtract(this.lastB);
            this.lastB = undefined;
        }

        let force = this.force.force(this.a, this.b);
        if (!force) {
            return;
        }
        this.lastA = apply(force.clone(), a);
        this.lastB = apply(force.negate(), b);
    }
}

export function apply(force, object) {
    if (!object) {
        return undefined;
    }
    const body = object.body;
    if (!body) {
        return undefined;
    }
    if (body.immovable) {
        return undefined;
    }
    if (!Number.isFinite(body.mass) || body.mass == 0) {
        return undefined;
    }
    force.scale(1/body.mass);
    body.acceleration.add(force);
    return force;
}