import Force from './force';

/**
 * Applies one of two different forces based on whether the distance between the applied bodies is less than, or greater than, some divider distance.
 */
export default class Piecewise extends Force {
    /**
     * @param {number} div - An arbitrary distance (so: positive values only). 
     */
    constructor(div, before, after) {
        super();
        this._divSq = div * div;
        this.before = before;
        this.after = after;
    }
    toString() {
        return `Or(${this.before}<${this.div}<=${this.after})`;
    }
    get div() {
        return Math.sqrt(this._divSq);
    }
    set div(div) {
        this._divSq = div * div;
    }

    /** By convention, the force on object A. */
    force(pma, pmb) {
        let distanceSq = pma.position.distanceSq(pmb.position);
        if (distanceSq < this._divSq) {
            if (this.before) {
                return this.before.force(pma, pmb);
            }
            return undefined;
        }
        if (this.after) {
            return this.after.force(pma, pmb);
        }
        return undefined;
   }
}