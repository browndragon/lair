/**
 * Implements the lifecycle of a manager.
 * (but not necessarily all the convenience methods!).
 * Owner is responsible for servicing these queues in this order:
 * - During `preUpdate`:
 * - `terminating`: by destructing each entry, calling `kill` with it, and then clearing the terminating queue.
 * - `pending`: by initializing each entry, calling `pause` or `resume` with it, and then clearing the pending queue.
 * - During `update`:
 * - `active`: by calling lifecycle methods `preUpdate`` & `update` with time ticks (though not both are necessarily supported etc).
 * Specializing the lifecycle methods to the actual managed class is the responsibility of the caller.
 */
export default class Qs {
    constructor() {
        this.active = new Set();
        this.paused = new Map();
        this.pending = new Set();
        this.terminating = new Set();
    }
    /** Prepares x to be a child of this object. If it will become one and wasn't already, returns true. */
    adopt(x) {
        for (let q of [this.active, this.paused, this.pending]) {
            if (q.has(x)) {
                return false;
            }
        }
        this.pending.add(x);
        return true;
    }
    /**
     * Adds x to the list of objects to later be removed from active queues.
     * Note that we disinherit before adopting, so if you do both, you'll disinherit and then immediately adopt.
     */
    disown(x) {
        this.terminating.add(x);
    }
    /** Immediately removes x from all queues; if `hard` does it from the pending and terminating queues as well. */
    kill(x, hard) {
        this.active.delete(x);
        this.paused.delete(x);
        if (hard) {
            this.pending.delete(x);
            this.terminating.delete(x);
        }
    }

    /** Returns true if active or pending after call (must have been paused or pending). */
    resume(x) {
        if (this.active.has(x)) {
            return true;
        }
        const into = this.paused.get(x);
        for (let q of [this.paused, this.pending]) {
            if (q.delete) {
                this.active.add(x);
                return true;
            }
        }
        return false;
    }
    /** True if suspended after call (must have been active or pending). */
    suspend(x) {
        if (this.paused.has(x)) {
            return true;
        }
        for (let q of [this.active, this.pending]) {
            if (q.delete(x)) {
                this.paused.set(x, q);
                return true;
            }
        }
        return false;
    }
}
