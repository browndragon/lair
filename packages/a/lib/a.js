"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _callable = require("@browndragon/callable");

var _sm = require("@browndragon/sm");

var _val = _interopRequireDefault(require("./val"));

var _tag = require("@browndragon/tag");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Root of the A graph. Note that states within the a graph never reach the undefined state: instead, when they *would* reach the undefined state, they go into the display state!
 */
class A extends _sm.Machine {
  constructor(cb) {
    super(cb);
    this.describes = [];
    this.options = [];
  }

  describe(s) {
    this.describes.push(s);
    return this;
  }

  option(label, cb) {
    this.options.push([label, cb]);
    return this;
  }

  finally(cb) {
    this.trap(cb);
    return this;
  }

  redirect(cb) {
    this.jump(cb);
    return this;
  }
  /** a.dd a description as a tagged template. */


  dd(strings, ...params) {
    return this.describe(String.raw(strings, ...params));
  }
  /**
   * a.sk (or really, offer) an option for later selection as a tagged template + following method invocation,
   * like:
   * ```
   *   a.sk`Go east`(eastwards)  // Some function `eastwards` defined elsewhere
   *       `Go west`(() => {
   *         a.dd`The pungent stench of mildew emanates from the wet dungeon walls`;
   *         a.sk`Go back east`(a.prev)  // can't do a.here, we're in a new node!
   *         a.sk`Kick door`(() => {...})  // Nest arbitrarily.
   *         // Special favor to you, A nodes reroute undefined to `display`.
   *       })
   *       `Wait here`(a.here);
   * ```
   */


  get sk() {
    let a = this;
    return function consumeTag(strings, ...params) {
      return function consumeData(cb, ...others) {
        if ((0, _tag.isTagExpr)(cb, ...others)) {
          console.warn('Unterminated ask chain', strings, params, 'into', cb, others);
          a.option(String.raw(strings, ...params), undefined); // This means someone screwed up: you had an empty option which you forgot to close!

          return a.sk(cb, ...others);
        }

        a.option(String.raw(strings, ...params), cb);
        return consumeTag;
      };
    };
  }
  /** a.fter() sets a finally/trap. */


  fter(cb) {
    this.finally(cb);
    return this;
  }
  /**
   * Displays all logged content & all options. Override it for better support.
   *
   * Suitable for use as a node (since it will be invoked in the context of `this` -- even though it's actually really a method on `this`!). Always transitions into state `select`.
   */


  display() {
    for (let i = 0; i < this.describes.length; ++i) {
      console.log('!', this.describes[i]);
    }

    this.describes = [];

    for (let i = 0; i < this.options.length; ++i) {
      console.log('?', 'Option', i, this.options[i][0]);
    }

    if (this.options.length <= 0) {
      // Since there are no options, the user can't select anything rational to proceed.
      // Return undefined -- maybe there's a trap?
      // This should halt execution, since there's now no safe way to proceed.
      return undefined;
    } // Otherwise, we're going to have to select an option which we displayed; the select state handles that.


    return this.select;
  }
  /**
   * Progresses to state [i] or repeats.
   */


  select(i) {
    let option = this.options[+i];

    if (!option) {
      // Oops, do-over!
      console.warn('Unrecognized option', i);
      return this.here;
    }

    this.options = [];
    return this.inline(option[1]);
  }

  _invoke(...params) {
    let result = super._invoke(...params); // This has already been checked for traps etc.


    if (result === undefined && this.here !== this.display) {
      // So: if they return undefined, we *should* halt, but we know that we need to pass through display so the human is prepared; do that now and let it control our next step.
      return this.inline(this.display);
    }

    return result;
  }

}

exports.default = A;