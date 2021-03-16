"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _callable = _interopRequireDefault(require("./callable"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Makes callables which expect to be `apply`d, `bind`d or `call`d easier to write.
 *
 * Callables make function's "this" weird, since it adds yet another definition; since the constructor often depends on this to be invocable, special care seems sensible.
 *
 * The `thisArg` is stored in `this.ctx` within the context of your call; it is restored to previous state afterwards.
 * In the special case of bind, a separate instance (via `new this.constructor()`) will then be Object.assigned from this, and have *its* ctx set.
 * Raw invokes do not modify the value of ctx in any way.
 */
class ContextCallable extends _callable.default {
  constructor(...params) {
    super(...params);
    this.ctx = undefined;
  }

  apply(ctx, args) {
    let oldCtx = this.ctx;

    try {
      this.ctx = ctx;
      return super.apply(this, args);
    } finally {
      this.ctx = oldCtx;
    }
  }

  bind(ctx, ...args) {
    let copy = new this.constructor();
    Object.assign(copy, this, {
      ctx
    });
    return copy;
  }

  call(ctx, ...args) {
    let oldCtx = this.ctx;

    try {
      this.ctx = ctx;
      return super.call(this, ...args);
    } finally {
      this.ctx = oldCtx;
    }
  }

}

exports.default = ContextCallable;