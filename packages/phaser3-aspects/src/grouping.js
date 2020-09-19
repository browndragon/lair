import Aspect from './aspect';

export default class Grouping extends Aspect {
    bound(object, data) {
        this.group().add(object);
        return data;
    }
    unbound(object) {
        this.group().remove(object);
    }
    makeGroup() {
        return this.add.group();
    }
    group() {
        return this[G] || (this[G] = this.makeGroup());
    }
}
const G = Symbol('Group');