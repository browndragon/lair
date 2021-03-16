"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _callable = require("@browndragon/callable");

var _isTagExpr = _interopRequireDefault(require("./isTagExpr"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A stateful function object which by default returns itself, and which implements a tagger protocol.
 * This lets you write:
 * ```
 * SomeTaggerClass.default`a ${'tag'}`('two', 'params')`another tag`()``;
 * ```
 * The above will evaluate to an instance of TagClass which has had the following calls:
 * ```
 * let someTagger = new SomeTaggerClass();  // extends Tag
 * someTagger.tag('a tag');
 * someTagger.next();
 * someTagger.data('two', 'params');
 * someTagger.next();
 * someTagger.tag('another tag')
 * someTagger.next();
 * someTagger.data();
 * someTagger.next();
 * someTagger.tag('');
 * someTagger.next();
 * ```
 * It's your responsibility to override `tag`, `data` and `next` -- in particular, if this should ultimately result in a non-self value, `next` should be overridden to recognize that and return (it might not if you rely on this for side effects).
 */
class Tag extends _callable.ContextCallable {
  constructor() {
    super((...params) => _consumeTag.apply(this, params));
  }
  /** Syntax sugar: "(new SomeTag())`someString`" looks weird vs "SomeTag.tag`someString`". */


  static get tag() {
    return new this();
  }
  /** Just does String.raw interpolation of the template strings + params. */


  interpolate(strings, ...params) {
    return String.raw(strings, ...params);
  }
  /** Override to handle "tag`someTemplate`" calls. */


  tag(s) {
    throw 'unimplemented';
  }
  /** Override to handle any other method invocation. */


  data(...d) {
    throw 'unimplemented';
  }
  /** Override if this eventually returns some constructed object or something. */


  next() {
    return this;
  }

}

exports.default = Tag;

function _consumeTag(strings, ...params) {
  if ((0, _isTagExpr.default)(strings, params)) {
    // A real template expression!
    this.tag(this.interpolate(strings, ...params));
  } else {
    // A method invocation mixed into the template expressions.
    let firstParameter = strings; // Handle `()` specially, since otherwise it would be called as `(undefined)`.
    // This has an obvious hole if we *intended* that and the receiving method is variadic.
    // But that's so weird as to not worry me.

    if (params.length == 0 && firstParameter === undefined) {
      this.data();
    } else {
      this.data(firstParameter, ...params);
    }
  }

  return this.next();
}