"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _phaser3Plugin = _interopRequireDefault(require("@browndragon/phaser3-plugin"));

var _anchor = _interopRequireDefault(require("./anchor"));

var _pair = _interopRequireDefault(require("./pair"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import Phaser from 'phaser';

/**
 * Constraints 0-4 bodies by a fixed corner for each, maintaining orientation.
 *
 * Hint: This can be used to hold bodies together in a soft-constrained grid pattern.
 */
class Corner extends _phaser3Plugin.default.Container {
  /** `center` is the center of the bond, which is the corner of each tile. */
  constructor(parent, center, force) {
    super(parent);
    this.force = force;
    this.anchors = {
      center: _anchor.default.ensure(center),
      ne: undefined,
      se: undefined,
      sw: undefined,
      nw: undefined
    };
    this.constraints = {
      // Connections along edges.
      nn: undefined,
      ee: undefined,
      ss: undefined,
      ww: undefined,
      // Connections to the center blob.
      ne: undefined,
      se: undefined,
      sw: undefined,
      nw: undefined
    };
  }

  get center() {
    return this.anchors.center;
  }

  set center(center) {
    return this._set('center', center);
  }

  get ne() {
    return this.anchors.ne.object;
  }

  set ne(ne) {
    return this._set('ne', ne);
  }

  get se() {
    return this.anchors.se.object;
  }

  set se(se) {
    return this._set('se', se);
  }

  get sw() {
    return this.anchors.sw.object;
  }

  set sw(sw) {
    return this._set('sw', sw);
  }

  get nw() {
    return this.anchors.nw.object;
  }

  set nw(nw) {
    return this._set('nw', nw);
  }

  _set(tag, value) {
    value = anchor[tag](value);

    if (this.anchors[tag] == value) {
      return;
    }

    for (let [peerName, constraintName] of Object.entries(constraints[tag])) {
      let constraint = this.constraints[constraintName];

      if (constraint) {
        constraint.stop();
      }

      if (value == undefined) {
        this.constraints[constraintName] = undefined;
        continue;
      }

      const peerAnchor = this.anchors[peerName];

      if (peerAnchor == undefined) {
        this.constraints[constraintName] = undefined;
        continue;
      }

      constraint = new _pair.default(this, value, peerAnchor, this.force);
      constraint[TAG] = constraintName;
      this.existing(constraint);
    }
  }

  add({
    target,
    atCorner
  }) {
    this[atCorner] = target;
    return this;
  }

  existing(constraint) {
    const name = constraint[TAG];
    console.assert(name in this.constraints);
    const old = this.constraints[name];

    if (old == constraint) {
      old.start();
      return;
    }

    if (old) {
      old.stop();
    }

    this.constraints[name] = constraint;
    super.existing(constraint);
  }

}

exports.default = Corner;
const TAG = Symbol('Tag');
const anchor = {
  ne(obj) {
    return _anchor.default.ensure(obj, {
      x: _anchor.default.width(obj),
      y: 0
    });
  },

  se(obj) {
    return _anchor.default.ensure(obj, {
      x: _anchor.default.width(obj),
      y: _anchor.default.height(obj)
    });
  },

  sw(obj) {
    return _anchor.default.ensure(obj, {
      x: 0,
      y: _anchor.default.height(obj)
    });
  },

  nw(obj) {
    return _anchor.default.ensure(obj, {
      x: 0,
      y: 0
    });
  }

};
/** value -> neighbor -> constraint name. */

const constraints = {
  ne: {
    center: 'ne',
    nw: 'nn',
    se: 'ee'
  },
  se: {
    center: 'se',
    ne: 'ee',
    sw: 'ss'
  },
  sw: {
    center: 'sw',
    nw: 'ww',
    se: 'ss'
  },
  nw: {
    center: 'nw',
    ne: 'nn',
    sw: 'ww'
  },
  center: {
    ne: 'ne',
    se: 'se',
    sw: 'sw',
    nw: 'nw'
  }
};