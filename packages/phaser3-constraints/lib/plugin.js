"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _phaser3Plugin = _interopRequireDefault(require("@browndragon/phaser3-plugin"));

var _anchor = _interopRequireDefault(require("./anchor"));

var _cluster = _interopRequireDefault(require("./cluster"));

var _corner = _interopRequireDefault(require("./corner"));

var _force = require("./force");

var _pair = _interopRequireDefault(require("./pair"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import Phaser from 'phaser';
class Plugin extends _phaser3Plugin.default.Plugin {
  create(config) {
    for (let [key, innerConfig] of Object.entries(config)) {
      switch (key) {
        case 'pair':
          return this.createPair(innerConfig);

        case 'cluster':
          return this.createCluster(innerConfig);

        case 'corner':
          return this.createCorner(innerConfig);

        default:
          throw new TypeError();
      }
    }

    throw `unsupported ${config}`;
  }

  createPair({
    a,
    aOffset,
    b,
    bOffset,
    ...rest
  }) {
    const aMass = _anchor.default.ensure(a, aOffset);

    const bMass = _anchor.default.ensure(b, bOffset);

    if (rest.length == undefined) {
      rest.length = aMass.position.distance(bMass.position);
    }

    const force = this.createForce(rest);
    return new _pair.default(this, aMass, bMass, force);
  }

  createCluster({
    center,
    centerOffset,
    member,
    members,
    ...rest
  }) {
    const centerMass = _anchor.default.ensure(center, centerOffset);

    const force = this.createForce(rest);
    let cluster = new _cluster.default(this, centerMass, force);

    if (member) {
      cluster.add({
        target: member
      });
    }

    if (members) {
      for (let member of members) {
        cluster.add({
          target: member
        });
      }
    }

    return cluster;
  }

  createCorner({
    center,
    centerOffset,
    ne,
    nw,
    se,
    sw,
    ...rest
  }) {
    const centerMass = _anchor.default.ensure(center, centerOffset);

    const force = this.createForce(rest);
    let corner = new _corner.default(this, centerMass, force);

    if (ne) {
      corner.ne = _anchor.default.ensure(ne);
    }

    if (se) {
      corner.se = _anchor.default.ensure(se);
    }

    if (sw) {
      corner.sw = _anchor.default.ensure(sw);
    }

    if (nw) {
      corner.nw = _anchor.default.ensure(nw);
    }

    return corner;
  }

  createForce(forceConfig) {
    if (forceConfig instanceof _force.Force) {
      return forceConfig;
    }

    for (let [key, innerConfig] of Object.entries(forceConfig)) {
      switch (key) {
        case 'damp':
          return this.createDamp(innerConfig);

        case 'fixed':
          return this.createFixed(innerConfig);

        case 'forces':
          return this.createForces(innerConfig);

        case 'piecewise':
          return this.createPiecewise(innerConfig);

        case 'spring':
          return this.createSpring(innerConfig);

        default:
          throw new TypeError(`Unrecognized ${forceConfig}`);
      }
    }

    throw `unsupported ${forceConfig}`;
  }

  createDamp(damp) {
    return new _force.Damp(damp);
  }

  createFixed(value) {
    return new _force.Fixed(value);
  }

  createForces(forces) {
    if (!Array.isArray(forces)) {
      forces = [forces];
    }

    return new _force.Forces(...forces.map(f => this.createForce(f)));
  }

  createFriction({
    length,
    to,
    fro,
    tan
  }) {
    return new Friction(length, tan, to, fro);
  }

  createSpring({
    length,
    stiffness
  }) {
    return new _force.Spring(length, stiffness);
  }

  createPiecewise({
    div,
    before,
    after
  }) {
    return new _force.Piecewise(div, this.createForce(before), this.createForce(after));
  }

}

exports.default = Plugin;