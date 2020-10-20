// import Phaser from 'phaser';
import P3P from '@browndragon/phaser3-plugin';
import Anchor from './anchor';
import Pair from './pair';

/** Constraints N+1 bodies by creating new pair constraints for each of them to a central object. */
export default class Cluster extends P3P.Container {
    constructor(parent, center, force) {
        super(parent);
        this.center = Anchor.ensure(center);
        this.force = force;
    }
    // Creates a new spring with the same semantics as all of the others between the center object and the new target & offset.
    create({target, offset}) {
        return new Pair(this,
            this.center, Anchor.ensure(target, offset), this.force
        );
    }
}