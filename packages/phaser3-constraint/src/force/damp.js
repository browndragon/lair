import Force from './force';

/** Applies a dampening factor based on the direction of force. */
export default class Damp extends Force {
    constructor(damp, force) {
        super();
        this.damp = damp;
        this._force = force;
    }
    toString() {
        return `Damp(damp=${this.damp},force=${this._force})`;
    }

    /** By convention, the force on object A. */
    force(pma, pmb) {
        let force = this._force.force(pma, pmb);
        if (force == undefined) {
            return undefined;
        }
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