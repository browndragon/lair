// import Phaser from 'phaser';
import consts from './consts';
import events from './events';

/**
 * A managed & playable object, like an Animation, Tween, or Constraint.
 *
 * These automatically have a state (which is its lifecycle -- not yet added, added, paused, etc), a notion of elapsed time & time scale (which respects pause state), and events around that state machine.
 *
 * By default, they're assumed one-way, one-use, and opaque. For instance, there's an explicit `stop` method to turn off a Managed; Managed instances must invoke it themselves if there is some completion state, or they will be called forever. Similarly, there's an 
 */
export default class Managed extends Phaser.Events.EventEmitter {
    constructor(parent) {
        super();
        this.parent = parent;

        this.timeScale = 1;
        this.elapsed = 0;
        this.callbacks = {
            onActive: null,
            onComplete: null
        };
        this.callbackScope = undefined;
    }

    /** Why you're here. Provides elapsed time/delta (relative to our timescale + parent timescale). */
    update(elapsed, delta) {
        throw 'IMPLEMENTME!';
    }

    /** Halts playback of a Managed. */
    pause() {
        if (this.state == consts.PAUSED) {
            return this;
        }
        this._pausedState = this.state;
        this.state = consts.PAUSED;
        return this;
    }
    /** Resumes playback of a Managed. */
    resume() {
        if (this.state == consts.PAUSED) {
            this.state = this._pausedState;
            // Not really used, but it's what we get initialized to, so...
            this._pausedState = consts.INIT;
            return this;
        }
        this.play();
        return this;
    }

    /** Turns off a running Managed. Call from your update method when done. */
    stop() {
        this._dispatchManagedEvent(events.COMPLETE, this.callbacks.onComplete);
        managed.removeAllListeners();
        switch (this.state) {
            case consts.REMOVED:
                return this;
            default:
                this.parent.remove(this);
        }
    }
    /** Plays a non-running Managed (if it started paused, or */
    play() {
        let state = this.state;
        switch (state) {
            case consts.ACTIVE:
                return this;
            case consts.PAUSED:
                this._makeActive();
                return this;
            case consts.PENDING_ADD:
                if (this._pausedState == consts.PENDING_ADD) {
                    return this;
                }
                break;
        }
        // In Tween, this means it was in one of the rampup/rampdown states.
        // But since this implementation separates those states, here it can only be a deletion
        // or turnup state.
        // Either way: Get it back through the "adding" queue.
        return this.restart();
    }

    setTimeScale(timeScale) {
        this.timeScale = timeScale;
        return this;
    }
    getTimeScale() {
        return this.timeScale;
    }

    isPlaying() {
        return this.state == consts.ACTIVE;
    }

    isPaused() {
        return this.state == consts.PAUSED;
    }

    /**
     * Manager lifecycle event when onboarding `this` during `.preUpdate`.
     * Returns truthy if the Manager should `play` the Managed (instead of just holding it).
     */
    init() {
        if (this.paused) {
            this.state = consts.PENDING_ADD;
            this._pausedState = consts.INIT;
            return false;
        }
        this.state = consts.INIT;
        return true;
    }

    /**
     * Internal; Manager.update lifecycle event on each tick.
     * Handles semantics around time scaling, pausing, etc.
     */
    _update(delta) {
        if (this.state == consts.PAUSED) {
            return;
        }
        delta *= this.timeScale;
        this.elapsed += delta;
        if (this.state != consts.ACTIVE) {
            return;
        }
        this.update(this.elapsed, delta);
    }

    /** Internal; makes active & dispatches events. */
    _makeActive() {
        this.parent.makeActive(this);
        this._dispatchManagedEvent(events.ACTIVE, this.callbacks.onActive);
    }

    _dispatchManagedEvent(event, callback) {
        this.emit(event, this);
        if (callback) {
            callback.call(this.callbackScope, this);
        }
    }
}