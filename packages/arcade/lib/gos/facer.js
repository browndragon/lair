"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = facer;
exports.F = void 0;

// import Phaser from 'phaser';

/**
 * Attaches a facing vector to a game object, together with special support for animation.
 *
 * Facing is similar to the sprite's native rotation/angle, but doesn't force the image to rotate. This is great for top-down games, where you have unique animations for sprites facing in different directions; facing @ 90deg shouldn't rotate the sprite 90deg, but show the sprite which is drawn facing at 90deg in its native orientation.
 *
 * `Quadrant` is the special term for `nn`, `ee`, etc -- the quadrant the facing vector is included within, using 45 degree lines between the quadrants.
 *
 * See `walker` for a `facer` which uses the getters of facing rotation (etc) to fetch directional info during animation.
 */
function facer(clazz, asSuffix = true) {
  if (clazz[F]) {
    return clazz;
  }

  return class extends clazz {
    static get [F]() {
      return true;
    }

    constructor(...params) {
      super(...params);
      this[F] = Phaser.Math.TAU;
      this[Q] = 'ss';
    }
    /** Exactly the same semantics as rotation & angle, but doesn't change the actual display of the sprite at all. */


    set facingRotation(rotation) {
      if (!Number.isFinite(rotation)) {
        throw new TypeError(`Not sure how to handle rotation ${rotation}`);
      }

      this[F] = Phaser.Math.Wrap(rotation, 0, Phaser.Math.PI2);
      this[Q] = quadrant(this[F]);
      return;
    }
    /** Exactly the same semantics as rotation & angle, but doesn't change the actual display of the sprite at all. */


    set facingVector(vector) {
      this.facingRotation = vector.angle();
    }
    /** Exactly the same semantics as rotation & angle, but doesn't change the actual display of the sprite at all. */


    set facingAngle(angle) {
      this.facingRotation = Phaser.Math.DegToRad(angle);
    }
    /**
     * Exactly the same semantics as rotation & angle, but logic only.
     * Phaser uses `rotation` to set the sprite display angle. There is a body
     * rotation too; that also affects sprite display angle. Both are not desired here,
     * where there's a unique display asset for each facing quadrant, but 
     */


    get facingRotation() {
      return this[F];
    }
    /** Exactly the same semantics as rotation & angle, but doesn't change the actual display of the sprite at all. */


    get facingAngle() {
      return Phaser.Math.RadToDeg(this[F]);
    }
    /** Returns one of `nn`, `ee`, `ss`, or `ww`. */


    get facingQuadrant() {
      return this[Q];
    }

  };
}

const F = Symbol('Facing');
exports.F = F;
const Q = Symbol('Quadrant');

function quadrant(rotation) {
  // Turn the circle one eighth, so that items "east-north-east" are considered east.
  const reoriented = Phaser.Math.Wrap(rotation + Phaser.Math.TAU / 2, 0, Phaser.Math.PI2); // Then divide on the quadrants.

  const quadrant = Math.floor(reoriented / Phaser.Math.TAU);

  switch (quadrant) {
    case 0:
      return 'ee';

    case 1:
      return 'ss';

    case 2:
      return 'ww';

    case 3:
      return 'nn';

    default:
      throw new TypeError(`Unrecognized quadrant ${quadrant} for ${rotation}`);
  }
}