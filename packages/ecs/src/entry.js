import {Context} from './system';

const States = {
    added: Symbol('added'),
    updated: Symbol('updated'),
    premoved: Symbol('premoved'),
    removed: Symbol('removed'),
    unchanged: Symbol('unchanged'),
    // & `undefined: undefined,`
};
export default class Entry extends Context {
    constructor(registry) {
        super();
        for (let state of Object.values(States)) {
            this[state] = new Set();
        }
        this.dirtyObserves = [];
        this.dirtyRemovals = [];
        this.isUpdating = false;
        this.registry = registry;
        // Set by the registry.
        this.system = null;
    }

    /** System.Context methods. */
    get added() {
        console.assert(this.isUpdating);
        return this[States.added];
    }
    get updated() {
        console.assert(this.isUpdating);
        return this[States.updated];
    }
    get removed() {
        console.assert(this.isUpdating);
        return this[States.removed];
    }
    observe(entity) {
        this.registry.observe(entity);
    }
    remove(entity) {
        this.registry.remove(entity);
    }

    /** Registry methods. */
    doObservation(entity) {
        if (this.isUpdating) {
            this.dirtyObserves.push(entity);
            return;
        }
        let has = this.getEntityState(entity);
        // 3 values:
        // true to subscribe & indicate change (add/update),
        // false to soft ignore (unchanged this round but DO subscribe!),
        // undefined to unsubscribe (remove, since we don't know what to do with it).
        // This is clearly a little crazy; change tracking belongs in this system.
        const wants = this.system.test(entity);
        if (wants == undefined) {  // || null.
            return this.doRemoval(entity);
        }
        if (wants) {
            switch (has) {
                case undefined: return this.updateState(entity, has, States.added);
                case States.premoved: return this.updateState(entity, has, States.added);
                case States.removed: return this.updateState(entity, has, States.updated);
                // It would be nice to do some diff detection here.
                case States.unchanged: return this.updateState(entity, has, States.updated);
                case States.added:  return undefined;  // No changes!
                case States.updated:  return undefined;  // No changes!
                default:
                    throw 'Unhandled case from complex state machine';
            }
        }
        // Otherwise, we don't have enough information to make a change.
        // So don't change anything!
    }
    doRemoval(entity, hard, now) {
        if (!now && this.isUpdating) {
            this.dirtyRemovals.push(entity);
            return;
        }
        let has = this.getEntityState(entity);
        if (hard) {
            return this.updateState(entity, has, undefined);
        }
        switch (has) {
            case undefined: return undefined;
            case States.added: return this.updateState(entity, has, States.premoved);
            default: return this.updateState(entity, has, States.removed);
        }            
    }
    /** Performs the update tick. */
    // Update vs updated. A bug waiting to happen?
    doUpdate(...params) {
        this.isUpdating = true;
        this.system.update(this, ...params);
        // Removed entries get cleared.
        for (let state of [States.premoved, States.removed]) {
            this[state].clear();
        }
        // Updated entries were handled, so clean them.
        for (let state of [States.added, States.updated]) {
            for (let entity of this[state]) {
                this.updateState(entity, state, States.unchanged);
            }
        }
        // Handle anything that was touched while we were updating.
        let dirtyObserves = this.dirtyObserves;
        let dirtyRemovals = this.dirtyRemovals;
        if (dirtyObserves.length > 0) {
            this.dirtyObserves = [];
        }
        if (dirtyRemovals.length > 0) {
            this.dirtyRemovals = [];
        }
        this.isUpdating = false;
        for (let entity of dirtyObserves) {
            this.observe(entity);
        }
        for (let entity of dirtyRemovals) {
            this.remove(entity);
        }
    }

    /** Internal state management methods. */
    getEntityState(entity) {
        for (let state of Object.values(States)) {
            if (this[state].has(entity)) {
                return state;
            }
        }
        return undefined;
    }
    updateState(entity, currentState, upcomingState) {
        if (currentState == upcomingState) {
            return;
        }
        if (currentState) {
            this[currentState].delete(entity);
        }
        if (upcomingState) {
            this[upcomingState].add(entity);
        }
    }
}
