/**
 * A tiny little state machine driver.
 * 
 * A set of states is an object whose methods take the state machine instance and potentially additional parameters, like:
 * ```
 * export const States = {
 *   on(sm) {sm.transition('off')},
 *   off(sm) {sm.transition('on')},
 * };
 * ```
 * You can make this into a state machine and drive it using the SM object and its `reset` method to tell it where to start:
 * ```
 * let machine = new SM(States).reset('off');
 * expect(machine.key).toEqual('off');
 * machine.step();
 * expect(machine.key).toEqual('off');
 * machine.step();
 * expect(machine.key).toEqual('on');
 * ```
 * SM's `before` and `after` can be overridden to handle cross-cutting behaviors:
 * ```
 * class LoggingSM extends SM {
 *   after(params) {
 *     console.log(`Transition ${this.from} -> ${this.to}`);
 *   }
 * }
 * let machine = new LoggingSM(States).reset('off');
 * // `Transition undefined -> off`
 * machine.step();
 * // `Transition off -> on`
 * ```
 */
export default class SM {
    // Constructs a state machine
    constructor(statesObject) {
        // You're not allowed to handle the undefined key.
        console.assert(!(undefined in this.states));

        // The object being driven. Key -> function(stateMachine, ...params).
        // That object must itself call stateMachine.transition if it intends
        // to do so; otherwise calls to `call` will just repeat the same state.
        this.states = statesObject;

        // The previous key (or undefined).
        this.from = undefined;
        // The current key. Null-y values require a reset to proceed.
        this.key = undefined;
    }

    // Externally transition into the given state (such as on startup).
    reset(stateKey = undefined) {
        this.transition(stateKey);
        return this;
    }

    // Internally cause a transition.
    // If the new state is different than the current state, leaves the current state and returns true, targeting the new state on the next step.
    // If it's the same, stays in the same state and returns false.
    transition(stateKey) {
        if (stateKey === undefined) {
            stateKey = this.key;
        }
        if (stateKey) {
            console.assert(stateKey in this.states);
        }

        this.from = this.key;
        this.key = stateKey;
        if (this.key == this.from) {
            return false;
        }
        this.after();
        return true;
    }

    // Call the current state and return its value.
    _increment(...params) {
        this.before(params);
        const state = this.states[this.key];
        console.assert(state);
        return state.call(this.states, this, ...params);
    }

    // Drive the state machine forward until the current state returns falsey.
    // This iteratively calls whatever method is currently under `this.key` (with the context of this state machine!) until that method returns falsey.
    // If the method wishes to progress, it must call `transition`.
    // Returns true if it transitioned at all.
    step(...params) {
        if (!this.key) {
            return false;
        }
        const initialKey = this.key;
        let lastKey = this.key;
        let anyChange = false;
        // Calls the current state.
        // If it returns true AND we transitioned in any way, go again.
        // Otherwise don't, since we'd just be calling back into the same state.
        while (this._increment(...params) && lastKey != this.key) {
            anyChange = anyChange || initialKey != this.key;
            lastKey = this.key;
        }
        return anyChange;
    }

    // Override to react *before* a transition is attempted.
    // The state function will be called with however you leave `this.key` (so if you transition here before the state is entered, it will be applied first).
    before(params) {}
    // Override to capture an attempted exit from a state. This is called during
    // the `transition` execution, so any changes you make to the `key` will be applied inline, but the calling state may still modify things.
    after() {}
}