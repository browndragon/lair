/**
 * Specializes the commands of a manager into the methods & data of a managed object.
 *
 * These aren't intended to be called directly, since 
 */
export default class Play {
    constructor(manager) {
        this.manager = manager;
    }
    init(x) { return true }
}
