import destructure from '@browndragon/destructure';
/**
 * Turns a callgraph into js iterable/iterator (though note next can take variadic args).
 *
 * It's implemented over the space of functions-returning-functions: each node is such a function, and the transition to take is the result returned by the node!
 * 
 * Cursors can be used for their visible nodechanges, or else their side effects.
 * The visible node change is the output values `done` and `value` (as required by iterator). Value is the next node to run, and when it is undefined, the cursor is done.
 * Additionally, Cursors can be "reset" into any given node via the `jump` operator, which immediately sets their value into the given value. Note that this may cause them to revert done-ness!
 */
export default class Cursor {
    constructor(node) {
        this.value = node;
        this._done = false;
        /**
         * Matches the signature of `value` -- if set, this is responsible for actually executing on each step!
         * It usually invokes `return this.here.apply(this, params)`, though potentially with some additional setup or teardown.
         */
        this.wrap = undefined;
    }
    /** Note that a cursor with no next node is also considered done. */
    get done() { return this._done || !this.value }
    /** Sets done. While value is undefined, done will still *read* as true. */
    set done(v) { this._done = v }

    /** Convenience spelling for the "current value", which is the function the node machine thinks is being executed. */
    get here() { return this.value }

    /** Resets next to the passed in value. */
    jump(value) {
        this.value = value;
        return this;
    }
    /** Progresses the cursor to the next value. */
    next(...params) {
        this.value = this._invoke(...params);
        return this;
    }

    /**
     * Combines a jump with a step for inlining of nodes.
     * You will *usually* want to call this like:
     * ```
     * return this.inline(Nodes.SomeNode, ...someParams);
     * ```
     * to indicate you want to hand control over to the other node to figure out where you're going.
     * However! You might instead know better! In which case, you might:
     * ```
     * return someDecision(this.inline(Nodes.SomeNode, ...someParams));
     * ```
     * (like: use their result iff not degenerate, otherwise use ours; or discard their result and only use ours).
     */
    inline(next, ...params) {
        if (!next) { return undefined }
        let current = this.value;
        try {
            this.value = next;
            return this._invoke(...params);
            // Does *not* store the value it's invoking!
        } finally {
            // Restore back to the state that called inline.
            this.value = current;
        }
    }

    /** Invokes the actual code under point. */
    _invoke(...params) {
        // Run wrap if we've got it or else the popped node, returning its result.
        return (this.wrap ? this.wrap : this.here).apply(this, params);
    }

    [Symbol.iterator]() { return this }
}