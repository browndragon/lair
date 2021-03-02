import destructure from '@browndragon/destructure';
/**
 * Turns a callgraph into js iterable/iterator (though note next can take variadic args).
 *
 * It's implemented over the space of functions-returning-functions: each state is such a function, and the transition to take is the result returned by the state!
 * 
 * Cursors can be used for their visible statechanges, or else their side effects.
 * The visible state change is the output values `done` and `value` (as required by iterator). Value is the next state to run, and when it is undefined, the cursor is done.
 * Additionally, Cursors can be "reset" into any given state via the `jump` operator, which immediately sets their value into the given value. Note that this may cause them to revert done-ness!
 */
export default class Cursor {
    constructor(state) {
        this.value = state;
        this._done = false;
    }
    /** Note that a cursor with no next state is also considered done. */
    get done() { return this._done || !this.value }
    /** Sets done. While value is undefined, done will still *read* as true. */
    set done(v) { this._done = v }

    /** Resets next to the passed in value. */
    jump(value) {
        this.value = value;
        return this;
    }
    /** Progresses the cursor to the next value. */
    next(...params) {
        return this.jump(this.value.apply(this, params));
    }
    /**
     * Combines a jump with a step for inlining of nodes.
     * You won't *always*, but you will *often*, want to call this like:
     * ```
     * return this.inline(States.SomeState, ...someParams);
     * ```
     * to indicate you want to hand control over to the other state to figure out where you're going.
     * However! You might instead know better! In which case, you might:
     * ```
     * return someDecision(this.inline(States.SomeState, ...someParams));
     * ```
     * (like: use their result iff not degenerate, otherwise use ours; or discard their result and only use ours).
     */
    inline(next, ...params) {
        let current = this.value;
        try {
            return this.jump(next).next(...params).value;
        } finally {
            // Restore state
            this.jump(current);
        }
    }

    [Symbol.iterator]() { return this }
}