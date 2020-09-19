export default class Registry {
    constructor() {
        this.components = new Map();
        this.systems = new Map();
    }
    system(System, ...params) {
        this.systems.set(System, new System(this, ...params));
    }
    component(Component, ...params) {
        this.components.set(Component, new Component(this, ...params));
        return this;
    }

    components(cb, ...Components) {
        if (Components.length == 0) {
            this.components.forEach(cb);
        }
        for (let C of Components) {
            cb(this.components.get(C));
        }
    }
    systems(cb, ...Systems) {
        if (Systems.length == 0) {
            this.systems.forEach(cb);
        }
        for (let S of Systems) {
            cb(this.systems.get(S));
        }
    }
}
