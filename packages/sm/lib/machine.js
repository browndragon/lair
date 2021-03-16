"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _cursor = _interopRequireDefault(require("./cursor"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A Cursor with additional support for function identities and redirection.
 *
 * Since Machines cache references to their states (unlike the much looser cursor!), they're much heavier on memory. But what you get is the ability to gracefully handle otherwise-anonymous nested functions, as well as history tracking.
 */
class Machine extends _cursor.default {
  /** @param next - A function matching the contract of `next`. */
  constructor(here) {
    super(here); // Internal storage state for all states seen by this map.

    this.states = new Map();
    this._trapNodes = new Set(); // Number of explicit calls to next that have occurred.

    this.nextCount = 0; // Number of invocations which has occurred -- at least one per next call, but also an additional 1 for each inline.

    this.invokeCount = 0; // Global user-specified data for nodes to communicate across.

    this.data = {}; // Prevent next from being called reentrantly. If you want that, you want `inline`.

    this._evaluatingNext = false;
    this._jumpTarget = undefined; // All evaluated states with 0 being the first one. Set *just* before evaluation.
    // This has to happen because if just *after* evaluation, inlines do *very* strange things to the invoke order.

    this._invokes = [];
  }
  /**
   * The index of the last invoked state *that is not the currently invoking state* (since that's `this.here`).
   */


  get prevIndex() {
    return this._invokes.length - (this._evaluatingNext ? 2 : 1);
  }
  /** The last invoked (not `here`) node. */


  get prev() {
    return this._invokes[this.prevIndex];
  }
  /** The invoke history leading up to `prev`. */


  get prevs() {
    return this._invokes.slice(0, this.prevIndex + 1);
  }
  /**
   * Executes the current `here` and sets the next value.
   */


  next(...params) {
    console.assert(!this._evaluatingNext);

    try {
      this._jumpTarget = undefined;
      this._evaluatingNext = true;
      this.nextCount++;
      this.state.lastNext = this.nextCount;
      return super.next(...params);
    } finally {
      this._evaluatingNext = false;

      if (this._jumpTarget) {
        return this.jump(this._jumpTarget);
      }
    }
  }

  _invoke(...params) {
    // Record that we've entered this node (even if wrap does something else, it did it aiming at this node).
    let here = this.here;

    if (!here) {
      return undefined;
    }

    this.invokeCount++;

    this._invokes.push(here);

    let state = this.state;
    state.count++;
    state.lastInvoke = this.invokeCount;
    state.lastNext = this.nextCount;

    let next = super._invoke(...params);

    let nextState = this.getState(next); // We return the trap state (if any!) for preference -- it's a trap! -- but without a trap, we just return the next state.

    return nextState.traps.pop() || next;
  }
  /**
   * As `Cursor.jump`, but additionally clears trap state.
   * This is the primary way to clear trap state, so nodes call `jump` to recontextualize.
   */


  jump(someNode) {
    if (this._evaluatingNext) {
      this._jumpTarget = someNode;
      return this;
    }

    for (let node of this._trapNodes) {
      let state = this.getState(node);
      state.traps = [];
    }

    this._trapNodes.clear();

    return super.jump(someNode);
  }
  /** Exposes mutable state information associated with the current node. */


  get state() {
    return this.getState(this.here);
  }

  getState(target) {
    let state = this.states.get(target);

    if (!state) {
      this.states.set(target, state = new State());
    }

    return state;
  } // Convenience methods for working with state:

  /** User-specc'd onetime initialization. Only valid for this node, since it's internal. */


  once(cb) {
    return this.state.initOnce(cb);
  }
  /**
   * Does one-time initialization of module-object inner methods. Convenience wrapper.
   *
   * A 'nest' is the module-object of inner functions to a node. See tests for more examples.
   *
   * @param cb - A no arg function returning a module object, an object whose keys are nodes you might transition into (non-node keys lightly pollute the namespace but it's fine). If you've already called nest for this target (implicitly, `here`), then it will *not* execute cb again, but return the cached copy from last time. You can also use ()=>function foo(){} to nest only one function, or ()=>[...] to nest multiple unnamed but indexed functions.
   * @param [target] - The node whose nest is being populated (implicitly, `here`).
   */


  nest(cb, target = this.here) {
    return this.getState(target).initNest(cb);
  }
  /**
   * Sets a trap so that any downstream (inline or retval) node which returns comeFrom (undefined by default) will once go to the goto state. All traps are cleared on jump.
   */


  trap(goTo, comeFrom = undefined) {
    this._trapNodes.add(comeFrom);

    let comeFromState = this.getState(comeFrom);
    comeFromState.traps.push(goTo);
    return this;
  }

}
/** Stores per-node information. */


exports.default = Machine;

class State {
  constructor() {
    /** Number of visits */
    this.count = 0;
    /** Machine's `nextCount` during last invoke */

    this.lastNext = undefined; // next counter during last visit.

    /** Machine's `invokeCount` during last invoke */

    this.lastInvoke = undefined; // invoke counter during last visit.

    /** Space for user-defined per-node data. */

    this.data = {}; // Scratch space for your node specific data.

    /** Cache for per-node onetime data. */

    this.once = undefined; // User defined onetime initialization.

    /** Cache for per-node nested functions. */

    this.nest = undefined; // Onetime initialized inner methods made static.

    /**
     * If this is set, attempts to transition into this state will instead result in clearing the trap and entering the trap state. This is useful/meaningful for undefined or null, but it seems very weird for real states. Maybe sensible for testing or instrumenting or something.
     */

    this.traps = [];
  }

  initOnce(cb) {
    if (this.once === undefined && cb) {
      this.once = cb();
    }

    return this.once;
  }

  initNest(cb) {
    if (!this.nest && cb) {
      this.nest = cb();
    }

    return this.nest;
  }

}