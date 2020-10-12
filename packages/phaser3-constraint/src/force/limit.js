import Force from './force';

/**
 * Applies the force only between min (if defined) and max (if defined).
 * Outside of these bounds, uses (WLOG) minInner (or undefined).
 */
export default class Limit extends Force {
    constructor(inner, min, max, minInner, maxInner) {
        super();
        this.inner = inner;
        this._min = min != undefined ? min * min : undefined;
        this.minInner = minInner;
        this._max = max != undefined ? max * max : undefined;
        this.maxInner = maxInner;
    }
    toString() {
        return `Limit(default:${this.inner},x<${this.min}=>${
            this.minInner},x>${this.max}=>${
            this.maxInner})`;
    }

    set min(min) {
        if (min == undefined) {
            this._min = undefined;
            return;
        }
        this._min = min * min;
    }
    get min() {
        return this._min != undefined ? Math.sqrt(this._min) : undefined;
    }
    set max(max) {
        if (max == undefined) {
            this._max = undefined;
            return;
        }
        this._max = max * max;
    }
    get max() {
        return this._max != undefined ? Math.sqrt(this._max) : undefined;
    }

    /** By convention, the force on object A. */
    force(pma, pmb) {
        let distance = pma.position.subtract(pmb.position);
        if (this._min != undefined && distance.lengthSq() < this._min) {
            if (this.minInner) {
                return this.minInner.force(pma, pmb);
            }
            // This seems like it presents a problem with damping...
            return undefined;
        }
        if (this._max != undefined && distance.lengthSq() > this._max) {
            if (this.maxInner) {
                return this.maxInner.force(pma, pmb);
            }
            // This seems like it presents a problem with damping...
            return null;
        }
        return this.inner.force(pma, pmb);
    }
}