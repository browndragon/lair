export default class System {
    constructor(registry) {
        this.registry = registry;
    }
    /** 
     * You should return:
     * * truthy: I want it! Add or update.
     * * undefined/null: I don't know what it is. Unsubscribe if I'm subscribed.
     * * any other falsey: I generally do want it, but it's not interesting right now. Don't change anything about it (don't subscribe if not subscribed; don't UNsubscribe if IS subscribed, etc).
     * In the future, the returned value might be diff'd so that not all true values force an
     * update; boolean `true` will always force an update however.
     */
    test(entity) {}

    /** Called in response to registry update with an instance of `Context` below. */
    update(context, ...params) {}
}

/** Interface class for use during `update` method. */
export class Context {
    /** Gets all entities this system newly `test`ed positive for this update. */
    get added() { throw 'unimplemented' }
    /** Gets all entities this system newly `test`ed positive for this update. */
    get updated() { throw 'unimplemented' }
    /** Gets all entities this system newly `test`ed positive for this update. */
    get removed() { throw 'unimplemented' }
}