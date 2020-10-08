import States from './states';

/**
 * A managed & playable object, like an Animation, Tween, or Constraint.
 *
 * These automatically have a state (which is the same as its lifecycle -- not yet added, added, paused, etc), a notion of elapsed time & time scale (which respects pause state), and events around that state machine.
 *
 * By default, they're assumed one-way, one-use, and opaque. For instance, there's an explicit `stop` method to turn off a Managed; Managed instances must invoke it themselves if there is some completion state, or they will be called forever.
 */
export default class Managed extends States {
    constructor(parent) {
        super(parent);

        this.useFrames = false;
        this.timeScale = 1;
        this.elapsed = undefined;
        // Badly named. This is "does it want to be paused, especially on startup", not "is this on the pending list", since the actual states around play/pause can be complex.
        this.paused = undefined;
    }

    /** Why you're here. Provides elapsed time/delta (relative to our timescale + parent timescale).
     * You can call `_complete` during your `update` implementation if you're done. This is the same as calling `stop` from outside.
     */
    update(elapsed, delta) {}

    /** Intended for internal use; turns off a running Managed from inside an update method. */
    _complete() {
        this.stop();
        return this;
    }
    /**
     * Manager lifecycle event when onboarding `this` during `.preUpdate`.
     * Returns truthy if the Manager should `play` the Managed (instead of just holding it).
     * Assumed to also handle all initialization for this managed, so override it.
     */
    init() {
        this.elapsed = 0;
        return !this.paused;
    }

    setTimeScale(timeScale) {
        this.timeScale = timeScale;
        return this;
    }
    getTimeScale() {
        return this.timeScale;
    }

    /**
     * Internal; Manager.update lifecycle event on each tick.
     * Handles semantics around time scaling, pausing, etc.
     */
    _update(delta) {
        if (!this.isPlaying()) {
            console.warn(`${this} got _update while not playing.`);
            return false;
        }
        delta *= this.timeScale;
        this.elapsed += delta;
        this.update(this.elapsed, delta);
        return true;
    }

    /**
     * Internal: wraps `emit` and callbacks to let managed instances suppress external state observation.
     */
    _dispatchManagedEvent(event, callback, callbackScope) {
        if (event) {
            this.emit(event, this);
        }
        if (callback) {
            callback.call(callbackScope, this);
        }
    }
}