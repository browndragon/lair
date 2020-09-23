export default class System {
    constructor(registry) {
        this.registry = registry;
    }

    /** 
     * You should return:
     * * truthy: I want it! Add or update.
     * * undefined/null: I don't know what it is. Unsubscribe if I'm subscribed.
     * * any other falsey: I generally do want it, but it's not interesting right now. Don't change anything about it (don't subscribe if not subscribed; don't UNsubscribe if IS subscribed, etc).
     */
    test(entity) {}

    /** Called in response to registry update. */
    update(context, added, updated, removed) {}
}