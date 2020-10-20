import Force from './force';

/** Models multiple forces which are summed together. */
export default class Forces extends Force {
    constructor(...forces) {
        super();
        this.forces = forces;
    }
    force(pma, pmb) {
        let sum = new Phaser.Math.Vector2();
        for (let force of this.forces) {
            let f = force.force(pma, pmb);
            if (f) {
                sum.add(f);
            }
        }
        return sum;
    }
}