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
        this.params = [];
    }

    // Convenience accessor; I kept typing this.
    get from() { return prev }
    // Convenience accessor; the semantics of "which state are you in right now" are kind of silly.
    get current() { return prev }

    // Externally transition into the given state (such as on startup).
    // This sets the next transition & its params, then executes the step.
    reset(stateKey=undefined, ...params) {
        this.transition(stateKey);
        this.step(...params);
        return this;
    }

    // Externally drive the state machine forward until the current state returns falsey.
    // This iteratively calls whatever method is currently under `this.next` (with the context of this state machine!) until that method returns falsey.
    // If the method wishes to progress, it must call `transition` inside itself.
    // Returns this object.
    step(...params) {
        this.params = params;
        while (this._increment() && this.prev != this.next) {}
        // Once we quiesce, the next time we enter a state will be because of a
        // new call to `step`, so clear out the params to avoid confusion.
        this.params = undefined;
        return this;
    }

    // Internally cause a transition, setting the next state method to run.
    // If the new state is different than the current state, leaves the current state and returns true, targeting the new state on the next step.
    // If it's the same, stays in the same state and returns false.
    transition(stateKey, ...params) {
        if (stateKey) {
            console.assert(stateKey in this.states);
        }
        if (stateKey === undefined) {
            return false;
        }
        if (this.next == stateKey) {
            return false;
        }
        this.next = stateKey;
        this.params = params;
        return true;
    }

    /** Hook before a nontrivial increment is attempted. */
    before() {}
    /** Hook when the next increment will be nontrivial. */
    after() {}


    _increment() {
        if (!this.next) {
            return false;
        }
        // Go before the transition 
        if (this.next != this.prev) {
            this.before();
        }

        const prevWas = this.prev;
        const nextWas = this.next;
        const state = this.states[nextWas];
        console.assert(state);
        const needsAnotherCall = state.call(
            this.states, this, ...this.params
        );
        // if the previous shifted out from under us, there was a concurrent modification. Horrifying. Abort.
        console.assert(this.prev == prevWas);
        // We expect/allow next to move, though, so use the copy we grabbed.
        this.prev = nextWas;

        if (this.next != this.prev) {
            this.after();
        }

        return needsAnotherCall;
    }
}
