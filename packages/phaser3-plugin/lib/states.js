"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _observables = require("./observables");

var _verbs = _interopRequireDefault(require("./verbs"));

var _sm = _interopRequireDefault(require("@browndragon/sm"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class MSM extends _sm.default {
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

    this.managed._dispatchManagedEvent(_observables.Events[this.next], this.callbacks[_observables.Callbacks[this.next]], this.callbackScope);
  }

  after() {}

}

class States extends Phaser.Events.EventEmitter {
  constructor(parent) {
    super();
    this.parent = parent;
    this.paused = false; // State to resume into.

    this._pausedState = 'INIT'; // This always starts in the pending_add state, but that requires
    // that you first interact with the `manager.existing` method.

    this.state = new MSM(this);
  } // Convenience for the single *actually* enabled state.


  isPlaying() {
    switch (this.state.prev) {
      case 'INIT':
      case 'ACTIVE':
        return true;

      default:
        return false;
    }
  } // State handling. 

  /** Initial state handling. */


  PENDING_ADD(sm, verb) {
    switch (verb) {
      // On initialization.
      case undefined:
        this.parent._add.add(this);

        return false;

      case _verbs.default.pause:
        this.parent._add.delete(this);

        return sm.transition('PAUSE');

      case _verbs.default.stop:
        this.parent._add.delete(this);

        return sm.transition('PENDING_REMOVE');

      case _verbs.default.resume:
      case _verbs.default.play:
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
      case _verbs.default.resume:
      case _verbs.default.play:
        this.parent._active.add(this);

        return false;

      case _verbs.default.pause:
        this.parent._active.delete(this);

        return sm.transition('PAUSE');

      case _verbs.default.remove:
        return sm.transition('PENDING_REMOVE');

      default:
        throw `Invalid ${verb} from ${this.next}`;
    }
  }

  PAUSE(sm, verb) {
    switch (verb) {
      case undefined:
      case _verbs.default.pause:
        if (sm.prev != 'PAUSE') {
          this._pausedState = sm.prev;
        }

        this.paused = true;
        return false;

      case _verbs.default.stop:
        return sm.transition('PENDING_REMOVE');

      case _verbs.default.resume:
        return sm.transition('_RESUME');

      case _verbs.default.play:
        return sm.transition('ACTIVE');

      case _verbs.default.destroy:
      default:
        throw `Invalid ${verb} from ${this.next}`;
    }
  }

  PENDING_REMOVE(sm, verb) {
    switch (verb) {
      case undefined:
      case _verbs.default.pause:
      case _verbs.default.stop:
        this.parent._destroy.add(this);

        return false;

      case _verbs.default.resume:
      case _verbs.default.play:
        return sm.transition('ACTIVE');

      case _verbs.default.destroy:
        return sm.transition('REMOVED');

      default:
        throw `Invalid ${verb} from ${this.next}`;
    }
  }
  /** Terminal state handling. */


  COMPLETE(sm, _verb) {
    return sm.transition(null);
  }
  /** (semi-)Terminal state handling. */


  REMOVED(sm, _verb) {
    sm.managed.removeAllListeners();
    return sm.transition('COMPLETE');
  } // Verb handling: reaches into our state machine and modifies it.

  /** Pauses playback of this object. */


  pause() {
    this.state.step(_verbs.default.pause);
    return this;
  }
  /** Restores from pause (playing or queued). */


  resume() {
    this.state.step(_verbs.default.resume);
    return this;
  }
  /** Forces this object out of active, and towards being destroyed. */


  stop() {
    this.state.step(_verbs.default.stop);
    return this;
  }
  /** Forces this object into active. */


  play() {
    this.state.step(_verbs.default.play);
    return this;
  }
  /** Indicates this object is being trashed. */


  destroy() {
    this.state.step(_verbs.default.destroy);
    return this;
  }

} // Check we've handled every verb.


for (let k of Object.keys(_verbs.default)) {
  console.assert(States.prototype[k]);
}

var _default = States;
exports.default = _default;