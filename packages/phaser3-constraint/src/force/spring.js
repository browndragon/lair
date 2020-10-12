import Force from './force'

export default class Spring extends Force {
    constructor(length, stiffness) {
        super();
        this.length = length;
        this.stiffness = stiffness;
    }
    toString() { return `Spring(l=${this.length},k=${this.stiffness})` }

    force(pma, pmb) {
        let offset = pma.position.subtract(pmb.position);
        const displacement = this.stiffness * (this.length - offset.length());
        offset.setLength(displacement);
        return offset;
    }
}
