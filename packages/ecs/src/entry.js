export default class Entry {
    constructor(system) {
        this.system = system;
        for (let state of Object.values(States)) {
            this[state] = new Set();
        }
        this.dirties = [];
        this.isUpdating = false;
    }

    observe(entity) {
        if (this.isUpdating) {
            this.dirties.push(entity);
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
            switch (has) {
                case States.added: return this.updateState(entity, has, States.premoved);
                default: return this.updateState(entity, has, States.removed);
            }
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
    update(context) {
        this.isUpdating = true;
        this.system.update(
            context,
            this[States.added].values(),
            this[States.updated].values(),
            this[States.removed].values(),
            // Premoved were removed before calling added, so don't even pass to system.
        );
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
        let dirties = this.dirties;
        if (dirties.length > 0) {
            this.dirties = [];
        }
        this.isUpdating = false;
        for (let entity of dirties) {
            this.observe(entity);
        }
    }
}

const States = {
    added: Symbol('added'),
    updated: Symbol('updated'),
    premoved: Symbol('premoved'),
    removed: Symbol('removed'),
    unchanged: Symbol('unchanged'),
};