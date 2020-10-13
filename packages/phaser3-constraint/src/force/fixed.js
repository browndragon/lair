// import Phaser from 'phaser';
import Force from './force';

/** Returns a constant velocity independent of  */
export default class Fixed extends Force {
    constructor(value) {
        super();
        this.value = new Phaser.Math.Vector2(value);
    }
    toString() {
        return `Fixed(${this.value})`;
    }
    /** By convention, the force on object A. */
    force(pma, pmb) {
        return this.value.clone();
    }
}