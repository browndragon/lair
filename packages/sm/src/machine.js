import Cursor from './cursor';

/**
 * A Cursor with additional support for function identities and redirection.
 *
 * Since Machines cache references to their states (unlike the much looser cursor!), they're much heavier on memory. But what you get is the ability to gracefully handle otherwise-anonymous nested functions, as well as history tracking.
 */
export default class Machine extends Cursor {
    /** @param next - A function matching the contract of `next`. */
    constructor(here) {
        super(here);

        // Internal storage state for all states seen by this map.
        this.states = new Map();
        this._trapNodes = new Set();

        // Number of explicit calls to next that have occurred.
        this.nextCount = 0;
        // Number of invocations which has occurred -- at least one per next call, but also an additional 1 for each inline.
        this.invokeCount = 0;
        // Global user-specified data for nodes to communicate across.
        this.data = {};

        // Prevent next from being called reentrantly. If you want that, you want `inline`.
        this._evaluatingNext = false;
        this._jumpTarget = undefined;

        // All evaluated states with 0 being the first one. Set *just* before evaluation.
        // This has to happen because if just *after* evaluation, inlines do *very* strange things to the invoke order.
        this._invokes = [];
    }
    /**
     * The index of the last invoked state *that is not the currently invoking state* (since that's `this.here`).
     */
    get prevIndex() {
        return this._invokes.length - (this._evaluatingNext ? 2 : 1);
    }
    /** The last invoked (not `here`) node. */
    get prev() {
        return this._invokes[this.prevIndex];
    }
    /** The invoke history leading up to `prev`. */
    get prevs() { return this._invokes.slice(0, this.prevIndex + 1) }

    /**
     * Executes the current `here` and sets the next value.
     */
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
                return this.jump(this._jumpTarget);
            }
        }
    }

    _invoke(...params) {
        // Record that we've entered this node (even if wrap does something else, it did it aiming at this node).
        let here = this.here;
        
        console.assert(here);
        // if (!here) {
        //     return undefined;
        // }

        this.invokeCount++;
        this._invokes.push(here);

        let state = this.state;
        state.count++;
        state.lastInvoke = this.invokeCount;
        state.lastNext = this.nextCount;

        let next = super._invoke(...params);
        let nextState = this.getState(next);
        // We return the trap state (if any!) for preference -- it's a trap! -- but without a trap, we just return the next state.
        return nextState.traps.pop() || next;
    }

    /**
     * As `Cursor.jump`, but additionally clears trap state.
     * This is the primary way to clear trap state, so nodes call `jump` to recontextualize.
     */
    jump(someNode) {
        if (this._evaluatingNext) {
            this._jumpTarget = someNode;
            return this;
        }
        for (let node of this._trapNodes.values()) {
            let state = this.getState(node);
            state.traps = [];
        }
        this._trapNodes.clear();
        return super.jump(someNode);
    }

    /** Exposes mutable state information associated with the current node. */
    get state() { return this.getState(this.here) }
    getState(target) {
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
     * Sets a trap so that any downstream (inline or retval) node which returns comeFrom (undefined by default) will once go to the goto state. All traps are cleared on jump.
     */
    trap(goTo, comeFrom=undefined) {
        this._trapNodes.add(comeFrom);
        let comeFromState = this.getState(comeFrom);
        comeFromState.traps.push(goTo);
        return this;
    }
}

/** Stores per-node information. */
class State {
    constructor() {
        /** Number of visits to this particular node */
        this.count = 0;
        /** Machine's `nextCount` during most recent invoke */
        this.lastNext = undefined;
        /** Machine's `invokeCount` during most recent invoke */
        this.lastInvoke = undefined;
        /** Space for user-defined per-node data. */
        this.data = {};  // Scratch space for your node specific data.
        /** Cache for per-node onetime data, run once per machine. */
        this.once = null;

        /**
         * If this is set, attempts to transition into this state will instead result in clearing the trap and entering the trap state. This is useful/meaningful for undefined or null, but it seems very weird for real states. Maybe sensible for testing or instrumenting or something.
         */
        this.traps = [];
    }
    initOnce(cb) {
        if (this.once === null && cb) {
            this.once = cb();
        }
        return this.once;
    }
}
