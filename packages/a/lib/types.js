"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Gonal = exports.Gram = exports.Mond = exports.Label = exports.Opt = exports.Log = exports.Base = void 0;

var _val = _interopRequireDefault(require("./val"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Base extends ContextCallable {
  constructor(self) {
    super(self);
  }

}
/**
 * When this node is evaluated, its text is printed and then it returns undef.
 */


exports.Base = Base;

class Log extends Base {
  constructor(text, next) {
    super(() => {
      this.ctx._log((0, _val.default)(text));

      return next;
    });
  }

}

exports.Log = Log;

class Opt extends Base {}
/** When this node is evaluated it populates a choice targeting the eventual result... */


exports.Opt = Opt;

class Label extends Opt {
  constructor(text, next, cond, repeat, fallback) {
    super(() => {
      if (this.isHidden()) {
        return undefined;
      }

      this.ctx._ifthenfinally((0, _val.default)(text), next, fallback);
    });
    this.next = next;
    this.cond = cond;
    this.repeat = repeat;
  }

  isHidden() {
    if (!this.repeat && this.ctx.count(this.next)) {
      return true;
    }

    if (this.cond && !this.cond()) {
      return true;
    }

    return false;
  }

}
/** When this node is evaluated it sets a fallback for all Grams, Labels & Monds in its scope. */


exports.Label = Label;

class Mond extends Opt {
  constructor(next) {
    super(() => this.inline(next));
  }

}
/** When this node is evaluated it inlines each Label in turn, then inlines displaying that to the user. */


exports.Mond = Mond;

class Gram extends Opt {
  constructor(...opts) {
    super(null);
  }

}
/** When this node is evaluated, it escapes the containing gram. */


exports.Gram = Gram;

class Gonal extends Base {
  constructor() {}

}

exports.Gonal = Gonal;