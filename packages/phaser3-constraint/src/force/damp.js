import Force from './force';

/** Applies a dampening factor based on the direction of force. */
export default class Damp extends Force {
    constructor(damp, inner) {
        super();
        this.damp = damp;
        this.inner = inner;
    }
    toString() {
        return `Damp(damp=${this.damp},${this.inner})`;
    }

    /** By convention, the force on object A. */
    force(pma, pmb) {
        let force = this.inner.force(pma, pmb);
        if (force == undefined) {
            return undefined;
        }
        // if (force.lengthSq() < 1e-12) {
        //     return force;
        // }
        // Component of velocity in the direction of force:
        // difference between the two dot products divided by the length times the
        // normalized unit vector.
        const projectedLength = this.damp * (
            pma.velocity.dot(force) - pmb.velocity.dot(force)
        ) / force.length();        
        force.setLength(force.length() - projectedLength);
        return force;
    }
}