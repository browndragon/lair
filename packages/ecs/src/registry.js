import Entry from './entry';

export default class Registry {
    constructor() {
        this.systems = new Set();
    }

    addSystem(SystemClass, ...params) {
        this.systems.add(new Entry(new SystemClass(this, ...params)));
        return this;
    }

    observe(entity) {
        for (let entry of this.systems.values()) {
            entry.observe(entity);
        }
    }

    update(context) {
        for (let entry of this.systems.values()) {
            entry.update(context);
        }
    }
}