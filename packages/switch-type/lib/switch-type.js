"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _builtinHandlers = _interopRequireDefault(require("./builtin-handlers"));

var _callable = _interopRequireDefault(require("@browndragon/callable"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class SwitchType extends _callable.default {
  constructor() {
    super((obj, cbs, ...params) => {
      const type = typeof obj;
      let cb = undefined;

      switch (type) {
        case 'bigint': // Fallthrough.

        case 'boolean': // Fallthrough.

        case 'number': // Fallthrough.

        case 'symbol':
          {
            for (cb of [cbs[type], cbs.value]) {
              if (cb) {
                return cb.call(cbs, obj, ...params);
              }
            }

            break;
          }

        case 'string':
          {
            // This is an *iterable value type*.
            for (cb of [cbs.string, cbs.value, cbs.iterable]) {
              if (cb) {
                return cb.call(cbs, obj, ...params);
              }
            }

            break;
          }

        case 'function':
          {
            for (cb of [cbs.function, cbs.value]) {
              if (cb) {
                return cb.call(cbs, obj, ...params);
              }
            }

            break;
          }

        case 'undefined':
          {
            for (cb of [cbs.undefined, cbs.null]) {
              if (cb) {
                return cb.call(cbs, obj, ...params);
              }
            }

            break;
          }

        case 'object':
          {
            if (obj == null) {
              for (cb of [cbs.null, cbs.undefined]) {
                if (cb) {
                  return cb.call(cbs, obj, ...params);
                }
              }

              break;
            } // Otherwise unconditionally check out the handlers.


            return this._switchObject(obj, cbs, params);
          }
      }

      if (cbs.default) {
        return cbs.default(obj, ...params);
      }
    });
    this.handlers = [..._builtinHandlers.default];
  }
  /** Returns a new instance with all of our handlers + additionals. */


  withHandlers(...handlers) {
    return new this.constructor().addHandlers(this.handlers).addHandlers(handlers);
  }
  /**
   * Modifies this instance's handlers to append the given args, adding new types
   * to the type system.
   * Since this library already handles Array, Map, Set, Regexp & Iterables, you will have
   * a difficult time separating out subtypes of these for special handling.
   */


  addHandlers(...handlers) {
    for (let handler of handlers) {
      this.handlers.push(handler);
    }

    return this;
  }
  /** Modifies this instance back to factory defaults. */


  resetHandlers(to = _builtinHandlers.default) {
    this.handlers = [];
    this.addHandlers(...to);
    return this;
  }
  /** Executes the handlers or, if none match, the `object` and `default` fallbacks. */


  _switchObject(obj, cbs, params) {
    for (let handler of this.handlers) {
      let methods = handler(obj, cbs);

      if (!methods) {
        continue;
      }

      for (let cb of methods) {
        if (!cb) {
          continue;
        }

        return cb.call(cbs, obj, ...params);
      } // We matched, we just didn't have anything to run.


      break;
    }

    if (cbs.object) {
      return cbs.object(obj, ...params);
    }

    if (cbs.default) {
      return cbs.default(obj, ...params);
    }
  }

}

var _default = new SwitchType();

exports.default = _default;