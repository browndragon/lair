import { Callbacks, Events } from './observables';
import Verbs from './verbs';
import SM from '@browndragon/sm';

class MSM extends SM {
    constructor(managed) {
        super(managed);
        this.managed = managed;
        this.callbacks = {};
        this.callbackScope = null;
    }
    before() {
        if (!this.next) {
            return;
        }
        this.managed._dispatchManagedEvent(Events[this.next], this.callbacks[Callbacks[this.next]], this.callbackScope);
    }
    after() {}
};

class States extends Phaser.Events.EventEmitter {
    constructor(parent) {
        super();
        this.parent = parent;

        this.paused = false;
        // State to resume into.
        this._pausedState = 'INIT';

        // This always starts in the pending_add state, but that requires
        // that you first interact with the `manager.existing` method.
        this.state = new MSM(this);
    }

    // Convenience for the single *actually* enabled state.
    isPlaying() {
        switch (this.state.prev) {
            case 'INIT':
            case 'ACTIVE':
                return true;
            default:
                return false;
        }
    }

    // State handling. 

    /** Initial state handling. */
    PENDING_ADD(sm, verb) {
        switch (verb) {
            // On initialization.
            case undefined:
                this.parent._add.add(this);
                return false;
            case Verbs.pause:
                this.parent._add.delete(this);
                return sm.transition('PAUSE');
            case Verbs.stop:
                this.parent._add.delete(this);
                return sm.transition('PENDING_REMOVE');
            case Verbs.resume:
            case Verbs.play:
                this.parent._add.delete(this);
                return sm.transition('ACTIVE');
            default:
                throw `Invalid ${verb} from ${this.next}`;
        }
    }
    _RESUME(sm) {
        const pausedState = this._pausedState;
        console.assert(pausedState);
        this._pausedState = undefined;
        return sm.transition(pausedState);
    }
    ACTIVE(sm, verb) {
        switch (verb) {
            case undefined:
            case Verbs.resume:
            case Verbs.play:
                this.parent._active.add(this);
                return false;
            case Verbs.pause:
                this.parent._active.delete(this);
                return sm.transition('PAUSE');
            case Verbs.remove:
                return sm.transition('PENDING_REMOVE');
            default:
                throw `Invalid ${verb} from ${this.next}`;
        }
    }
    PAUSE(sm, verb) {
        switch (verb) {
            case undefined:
            case Verbs.pause:
                if (sm.prev != 'PAUSE') {
                    this._pausedState = sm.prev;
                }
                this.paused = true;
                return false;
            case Verbs.stop:
                return sm.transition('PENDING_REMOVE');
            case Verbs.resume:
                return sm.transition('_RESUME');
            case Verbs.play:
                return sm.transition('ACTIVE');
            case Verbs.destroy:
            default:
                throw `Invalid ${verb} from ${this.next}`;
        }
    }
    PENDING_REMOVE(sm, verb) {
        switch (verb) {
            case undefined:
            case Verbs.pause:
            case Verbs.stop:
                this.parent._destroy.add(this);
                return false;
            case Verbs.resume:
            case Verbs.play:
                return sm.transition('ACTIVE');
            case Verbs.destroy:
                return sm.transition('REMOVED');
            default:
                throw `Invalid ${verb} from ${this.next}`;
        }
    }
    /** Terminal state handling. */
    COMPLETE(sm, verb) {
        return sm.transition(null);
    }
    /** (semi-)Terminal state handling. */
    REMOVED(sm, verb) {
        sm.managed.removeAllListeners();
        return sm.transition('COMPLETE');
    }

    // Verb handling: reaches into our state machine and modifies it.
    /** Pauses playback of this object. */
    pause() {
        this.state.step(Verbs.pause);return this;
    }
    /** Restores from pause (playing or queued). */
    resume() {
        this.state.step(Verbs.resume);return this;
    }
    /** Pauses playback of this object. */
    stop() {
        this.state.step(Verbs.stop);return this;
    }
    /** Pauses playback of this object. */
    play() {
        this.state.step(Verbs.play);return this;
    }
    /** Pauses playback of this object. */
    destroy() {
        this.state.step(Verbs.destroy);return this;
    }
}

// Check we've handled every verb.
for (let k of Object.keys(Verbs)) {
    console.assert(States.prototype[k]);
}

export default States;