import Anchor from '../anchor';
import Force from './force';

/**
 * Dampens motion between two bodies on the basis of their radial and angular components relative to each other.
 */
export default class Friction extends Force {
    /**
     * @param {number} length - The maximum distance at which to apply these forces.
     * @param {number} tan - The amount of dampening to exert when the bodies are sliding orthogonally to their placement.
     * @param {number} to - The amount of dampening to exert when the bodies are closing distance.
     * @param {number} fro - The amount of dampening to exert when the bodies are departing distance.
     */
    constructor(length, tan, to=0, fro=0) {
        super();
        this.length = length;
        this.tan = tan;
        this.to = to;
        this.fro = fro;
    }
    toString() {
        return `Friction(length=${this.length},tan=${this.tan},to=${this.to},fro=${this.fro})`;
    }
    set length(length) {
        console.assert(Number.isFinite(length));
        this._dlength = length;
        this._length = length * length;
    }
    get length() { return this._dlength }
    set tan(tan) { this._set('tan', tan) }
    get tan() { return this._dtan }
    set to(to) { this._set('to', to) }
    get to() { return this._dto }
    set fro(fro) { this._set('fro', fro) }
    get fro() { return this._dfro }
    _set(tag, value) {
        console.assert(Number.isFinite(value));
        this[`_d${tag}`] = value;
        this[`_${tag}`] = -value/(1+value);
    }

    /** By convention, the force on object A. */
    force(pma, pmb) {
        let [position, velocity] = pma.relative(pmb);

        if (position.lengthSq() > this._length) {
            return undefined;
        }
        const radialFriction = position.dot(velocity) > 0 ? this._to : this._fro;

        let radial = Anchor.project(position, velocity);
        let tangential = velocity.subtract(radial);

        radial.scale(radialFriction);
        tangential.scale(this._tan);

        return radial.add(tangential);
    }
}
