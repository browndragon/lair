import Cursor from './cursor';

/**
 * A Cursor with additional return semantics.
 *
 * In particular, this retains a stack of future states to join, so that any states which screw up and return undefined can conveniently restore to trap. It also maintains a count of states entered and history of states entered.
 *
 * This might not be necessary. Maintaining the history *could* be done more successfully in a motivated 'wrap' method. Trap could exist outside of the machine (its primary use case is in @browndragon/log:option, where it's implemented otherwise!). To the degree wrap is valuable, we could just merge machine and cursor. To the degree the stack is valuable, we could maintain it at two elements.
 */
export default class Machine extends Cursor {
    /** @param next - A function matching the contract of `next`. */
    constructor(state) {
        super(state);

        /**
         * Matches the signature of `next` -- if set, this is responsible for actually executing on each step!
         * It usually invokes `return this.state.apply(this, params)`, though potentially with some additional setup or teardown.
         */
        this.wrap = undefined;

        /** Stack of stored future states. */
        this.stack = [];
        /** Level to set traps at by default. Useful if you install some system redirection handlers (debugging?) at 0 or 1, and want to have the rest of the state machine live at level 1 or 2. */
        this.traplevel = 0;
        /** Stack of past states. A traversal of `states`. Tip is most recent. */
        this.prevs = [];
        this.prevCount = new Map();
    }
    // -2?! Yes: Prev is most useful within wrap or within the actual state methods themselves, which have already started running by the time this is invoked, so that -1 would actually be .value itself, which we already know.
    get prev() { return this.prevs[this.prevs.length - 2] }

    /**
     * Modifies `stack` for restore points. Higher levels are considered more volatile, but in all cases they're cooperative within your code, so I recommend keeping a small enum of values (like: LOCATION=0,ROOM=1,FEATURE=2 or something).
     * This gets used so that if you have a forest of nodes below this point which are too annoying to manage all exits, you can remap the semantics of `undefined` to mean "go to the comefrom marker" instead of "abort program"; since the level argument forces it to be safely reentrant, it's always correct to re-call trap.
     * Once one node uses the trap, it's removed from the stack; you can also repeat your call to trap with `null` for the second parameter to force the issue though it's rarely required.
     */
    trap(level=this.traplevel, comefrom=undefined) {
        if (comefrom === undefined) {
            comefrom = this.value;
        }
        this.stack.splice(level, this.stack.length - level);
        if (comefrom) {
            this.stack[level] = (comefrom || this.value);
        }
    }

    /**
     * Modifies value to jump to the indicated value (or, if jumping to nowhere, back to the last `trap`).
     */
    jump(value) {
        while (!value && this.stack.length) {
            value = this.stack.pop();
        }
        return super.jump(value);
    }

    _invokeNext(params) {
        // Pop off the front of the history queue. This is what we're currently processing.
        let state = this.value;
        // Record that we've entered this state (even if wrap does something else, it did it aiming at this state).
        this.prevs.push(state);
        this.prevCount.set(state, 1 + (this.prevCount.get(state) || 0));
        // Run wrap if we've got it or else the popped state, returning its result.
        return (this.wrap ? this.wrap : state).apply(this, params);
    }
    next(...params) {
        return this.jump(this._invokeNext(params));
    }
}
