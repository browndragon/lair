import induct from './induct';

export default function Member(clazz, ...sgs) {
    if (!clazz[TargetGroups]) {
        clazz = class extends clazz {
            /** Convenience method for the last group's class defined on the Member. */
            static get LastGroup() { return this[TargetGroups][this[TargetGroups].length - 1] }
            addedToScene() {
                super.addedToScene();
                let scene = this.scene;
                induct(this, ...this.constructor[TargetGroups]);
            }
        };
        clazz[TargetGroups] = [];
    }
    clazz = class extends clazz {};
    console.assert(Array.isArray(clazz[TargetGroups]));
    clazz[TargetGroups] = [...clazz[TargetGroups], ...sgs];
    return clazz;
}
const TargetGroups = Symbol('TargetGroups');
