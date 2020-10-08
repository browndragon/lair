/** Treats an arbitrary object as a state machine. */
export default class SM {
    // Constructs a state machine from the statesObject.
    // Whenever this instance calls reset, the statesObject method of the same name will be 
    constructor(statesObject) {
        // You must have a handler object.
        console.assert(statesObject);
        // You're not allowed to handle the undefined key.
        console.assert(!(undefined in statesObject));

        // The object being driven. Key -> function(stateMachine, ...params).
        // That object must itself call stateMachine.transition if it intends
        // to do so; otherwise calls to `call` will just repeat the same state.
        this.states = statesObject;

        // The last completely run state method. DURING a state call, this will be the previously executed run state method.
        this.prev = undefined;
        // The next state method to run. Has not completed execution yet.
        this.next = undefined;
    }

    // Convenience accessor; I kept typing this.
    get from() {
        return prev;
    }
    // Convenience accessor; the semantics of "which state are you in right now" are kind of silly.
    get current() {
        return prev;
    }

    // Externally transition into the given state (such as on startup).
    // This sets `next` but does NOT enter it (that's for `step` to do).
    // As a result, during setup, you may need to call new `SM(...).reset('start').step(someParams)` if you need to actually enter an initialization phase.
    reset(stateKey = undefined) {
        this.transition(stateKey);
        return this;
    }

    // Externally drive the state machine forward until the current state returns falsey.
    // This iteratively calls whatever method is currently under `this.next` (with the context of this state machine!) until that method returns falsey.
    // If the method wishes to progress, it must call `transition` inside itself.
    // Returns this object.
    step(...params) {
        while (true
        // Try the next state; if it says we're done we're done, otherwise...
        && this._increment(...params)
        // If it wanted to continue AND there's a real transition, continue.
        && this.prev != this.next) {}
        return this;
    }

    // Internally cause a transition, setting the next state method to run.
    // If the new state is different than the current state, leaves the current state and returns true, targeting the new state on the next step.
    // If it's the same, stays in the same state and returns false.
    transition(stateKey) {
        if (stateKey) {
            console.assert(stateKey in this.states);
        }
        if (this.next == stateKey) {
            return false;
        }
        this.next = stateKey;
        return true;
    }

    /** Hook before a nontrivial increment is attempted. */
    before(params) {}
    /** Hook when the next increment will be nontrivial. */
    after(params) {}

    _increment(...params) {
        // Go before the transition 
        if (this.next != this.prev) {
            this.before(params);
        }
        // If we're not in any state, we cannot step.
        if (!this.next) {
            return false;
        }

        const prevWas = this.prev;
        const nextWas = this.next;
        const state = this.states[nextWas];
        console.assert(state);
        const needsAnotherCall = state.call(this.states, this, ...params);
        // if the previous shifted out from under us, there was a concurrent modification. Horrifying. Abort.
        console.assert(this.prev == prevWas);
        // We expect/allow next to move, though, so use the copy we grabbed.
        this.prev = nextWas;

        if (this.next != this.prev) {
            this.after(params);
        }

        return needsAnotherCall;
    }
}