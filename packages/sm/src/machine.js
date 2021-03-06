import Cursor from './cursor';

/**
 * A Cursor with additional support for function identities.
 *
 * Since Machines cache references to their states (unlike the much looser cursor!), they're much heavier on memory. But what you get is the ability to gracefully handle otherwise-anonymous nested functions, as well as history tracking.
 */
export default class Machine extends Cursor {
    /** @param next - A function matching the contract of `next`. */
    constructor(here) {
        super(here);

        // Internal storage state for all states seen by this map.
        this.states = new Map();

        // Number of explicit calls to next that have occurred.
        this.nextCount = 0;
        // Number of invocations which has occurred -- at least one per next call, but also an additional 1 for each inline.
        this.invokeCount = 0;
        // Global user-specified data for nodes to communicate across.
        this.data = {};

        // Prevent next from being called reentrantly. If you want that, you want `inline`.
        this._evaluatingNext = false;
        this._jumpTarget = undefined;
    }
    get prev() { return this.state.comeFrom }
    /** Prevs sorted with 0 being the most recent (including not yet run!), and n the earliest (or first repeat). */
    *rprevs() {
        let caller = this.here;
        let called = new Set();
        while (caller != undefined) {
            yield caller;
            if (called.has(caller)) {
                break;
            }
            called.add(caller);
            caller = this.getState(caller).comeFrom;
        }
    }
    get prevs() { return [...this.rprevs()].reverse() }

    next(...params) {
        console.assert(!this._evaluatingNext);
        try {
            this._jumpTarget = undefined;
            this._evaluatingNext = true;
            this.nextCount++;
            this.state.lastNext = this.nextCount;

            return super.next(...params);            
        } finally {
            this._evaluatingNext = false;
            if (this._jumpTarget) {
                return this.jump(...this._jumpTarget);
            }
        }
    }

    inline(next, ...params) {
        let nextState = this.getState(next);
        nextState.comeFrom = this.here;
        nextState.goTo = this.state.goTo;
        // So what do we do on the way back in if they've jumped?
        // X->Y[JUMP Z] for instance.
        // Then here will be Z (not Y) -- but we don't know the caller of inline is done executing; they may even continue to call children.
        // The sanest thing to do might be to throw an exception (so that it can percolate up the stack back to `next`.
        return super.inline(next, ...params);            
    }

    _invoke(...params) {
        // Record that we've entered this node (even if wrap does something else, it did it aiming at this node).
        let here = this.here;
        if (!here) {
            return undefined;
        }
        let state = this.state;

        this.invokeCount++;
        state.count++;
        state.lastInvoke = this.invokeCount;
        state.lastNext = this.nextCount;

        let next = super._invoke(...params);
        let trapped = next === undefined && state.goTo;
        if (trapped) {
            next = state.goTo;
        }
        if (next) {
            let nextState = this.getState(next);
            nextState.comeFrom = here;
            if (!trapped) {
                // If it *was* the result of a trap, don't screw with its own recovery path.
                nextState.goTo = state.goTo;
            }
        }
        return next;
    }

    jump(someState, comeFrom) {
        if (this._evaluatingNext) {
            this._jumpTarget = [someState, comeFrom];
            return undefined;
        }
        super.jump(someState);
        let state = this.state;
        state.comeFrom = comeFrom;
        state.goTo = comeFrom && comeFrom.goTo;
        return this;
    }

    /** Exposes mutable state information associated with the current node. */
    get state() { return this.getState() }
    getState(target=this.here) {
        let state = this.states.get(target);
        if (!state) {
            this.states.set(target, state = new State());
        }
        return state;
    }
    // Convenience methods for working with state:
    /** User-specc'd onetime initialization. Only valid for this node, since it's internal. */
    once(cb) { return this.state.initOnce(cb) }
    /**
     * Does one-time initialization of module-object inner methods. Convenience wrapper.
     *
     * A 'nest' is the module-object of inner functions to a node. See tests for more examples.
     *
     * @param cb - A no arg function returning a module object, an object whose keys are nodes you might transition into (non-node keys lightly pollute the namespace but it's fine). If you've already called nest for this target (implicitly, `here`), then it will *not* execute cb again, but return the cached copy from last time.
     * @param [target] - The node whose nest is being populated (implicitly, `here`).
     */
    nest(cb, target=this.here) { return this.getState(target).initNest(cb) }
    /**
     * Sets a trap so that any downstream (inline or retval) node which returns undefined (NOT null) will instead return the indicated value.
     */
    trap(goTo) {
        let hereState = this.state;
        let goToState = this.getState(goTo);

        goToState.goTo = hereState.goTo;
        hereState.goTo = goTo;
        return goTo;
    }
}

/** Stores per-node information. */
class State {
    constructor() {
        /** Number of visits */
        this.count = 0;
        /** Machine's `nextCount` during last invoke */
        this.lastNext = undefined;  // next counter during last visit.
        /** Machine's `invokeCount` during last invoke */
        this.lastInvoke = undefined;  // invoke counter during last visit.
        /** Space for user-defined per-node data. */
        this.data = {};  // Scratch space for your node specific data.
        /** Cache for per-node onetime data. */
        this.once = undefined;  // User defined onetime initialization.
        /** Cache for per-node nested functions. */
        this.nest = undefined;  // Onetime initialized inner methods made static.

        /**
         * Node immediately preceeding this state.
         * You can't always reconstruct entire history based on this, since you could have A->X->B->X->C, in which case
         * we'd have C comefrom X, X comefrom B, B comefrom X, X comefrom !B! -- A is lost.
         * Jumps can tell lies to goto also.
         */
        this.comeFrom = undefined;
        /**
         * A goto "recovery path" set from this node to *all downstream nodes* (retval or inline); set when comefrom is set.
         * The tainting can be broken by breaking the comefrom chain via `jump` with no comefrom.
         * It's triggered with the offending node when a node returns undefined (NOT null).
         */
        this.goTo = undefined;
    }
    initOnce(cb) {
        if (this.once === undefined && cb) {
            this.once = cb();
        }
        return this.once;
    }
    initNest(cb) {
        if (!this.nest && cb) {
            this.nest = cb();
        }
        return this.nest;
    }
}
