/**
 * All System superclasses' `test` methods must be a superset of the children's `test` methods.
 * This is for efficiency: it allows the registry to maintain a tree of Systems and call
 * `super.[...].super.test` and `super.test` for you, caching the results.
 */
export default class System {
    constructor(context) {
        this.context = context;
    }
    /** 
     * You should return:
     * * truthy: I want it! Add or update.
     * * undefined/null: I don't know what it is. Unsubscribe if I'm subscribed.
     * * any other falsey: I generally do want it, but it's not interesting right now. Don't change anything about it (don't subscribe if not subscribed; don't UNsubscribe if IS subscribed, etc).
     * In the future, the returned value might be diff'd so that not all true values force an
     * update; boolean `true` will always force an update however.
     * In the future, your parents' `test` might also be called on you and cached for your siblings; this will allow something like a `PhysicsSystem` base class to check only for those entities that already have `.body` and ignore all of those which don't.
     */
    test(entity) { return entity }

    /** Called in response to registry update with an instance of `Context` below. */
    update(...params) {}
}

/** Interface class for use during `update` method. */
export class Context {
    /** Gets all entities this system newly `test`ed positive for this update. */
    get added() { throw 'unimplemented' }
    /** Gets all entities this system newly `test`ed positive for this update. */
    get updated() { throw 'unimplemented' }
    /** Gets all entities this system newly `test`ed positive for this update. */
    get removed() { throw 'unimplemented' }

    /** Causes this entity to be reobserved by all systems. */
    observe(entity) { throw 'unimplemented' }
    /** Causes this entity to be removed from all systems. */
    remove(entity) { throw 'unimplemented' }
}