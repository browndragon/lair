import Entry from './entry';

export default class Registry {
    constructor() {
        this[S] = new Set();
    }

    /**
     * Registers a system for calls to observe, remove, etc.
     */
    add(SystemClass, ...params) {
        let system = new SystemClass(this, ...params);
        let entry = new Entry(system);
        this[S].add(entry);
        return this;
    }

    /**
     * Calls `test` on each system, and moves the entity into the proper bucket for
     * the next call to `update`.
     */
    observe(entity) {
        for (let entry of this[S].values()) {
            entry.observe(entity);
        }
        return this;
    }

    /**
     * Removes an entity from each system:
     * * `hard` goes straight to removal (without an update in the `removed` set).
     * * `now` ignores systems update cycle, and removes the entry before the call returns.
     */
    remove(entity, hard=undefined, now=undefined) {
        for (let entry of this[S].values()) {
            entry.remove(entity, hard, now);
        }
        return this;
    }

    update(...params) {
        for (let entry of this[S].values()) {
            entry.update(...params);
        }
    }

    forEach(cb) {
        for (let entry of this[S].values()) {
            cb(entry.system);
        }
    }
}
export const S = Symbol('Systems');