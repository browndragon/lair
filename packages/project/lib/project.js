"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _callable = _interopRequireDefault(require("@browndragon/callable"));

var _switchType = _interopRequireDefault(require("@browndragon/switch-type"));

var _obj = _interopRequireDefault(require("@browndragon/obj"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** Gets the value from o for each key (recursively) in t. */
class Project extends _callable.default {
  constructor() {
    super((o, t) => {
      return (0, _switchType.default)(t, this, o);
    });
  }

  undefined(t, o) {
    // When the template is undefined, return any encountered object value ("no restriction").
    return o;
  }

  function(t, o) {
    // When the template is a function, return its result.
    return t(o);
  }

  value(t, o) {
    // When the template is a value, return o when it's equivalent.
    return t == o ? o : undefined;
  }

  regExp(t, o) {
    // When the template is a regex, return o when it matches.
    return t.test(o) ? o : undefined;
  }

  empty(t, o) {
    // When the template is an object with no entries, return an object with no entries
    // when o is present.
    return o == undefined ? undefined : {};
  }

  iterable(t, o) {
    // When the template is an iterable, return a new iterable recursing.
    // This feels VERY hard to work with! Consider f() instead...
    let result = [];

    for (let i = 0; i < t.length; ++i) {
      const res = this(t[i], o[i]);
      result.push(res == undefined ? undefined : res);
    }

    return result;
  }

  associative(t, o) {
    if (o == undefined) {
      return undefined;
    }

    let result = {};

    for (let [k, tv] of _obj.default.entries(t)) {
      _obj.default.set(result, k, this(_obj.default.get(o, k), tv));
    }

    return result;
  }

  default(t, o) {
    throw `Unhandled template type: ${t} at ${o}`;
  }

}

var _default = new Project();

exports.default = _default;