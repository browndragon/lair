"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

// import Phaser from 'phaser';
class Spring {
  constructor() {
    this.k = 0;
    this.d = 0;
    this.l = 0;
    this._a = undefined;
    this.aOffset = kCenter;
    this._b = undefined;
    this.bOffset = kCenter;
    this.scratch = Phaser.Math.Vector2.ZERO.clone(); // Records the last-known values.

    this.impulse = 0;
    this.length = 0; // A bit of a misnomer -- this ends up being the actual directional vector of impulse, and is kind of crazy. Do not look directly at internal state transfer mechanism.

    this.displacement = Phaser.Math.Vector2.ZERO.clone(); // "absolute displacement in X and Y"

    this.lX = 0;
    this.lY = 0;
  }
  /** 
   * @param {number} k - The 0-1 spring constant, where 0 is unconstrained and 1 is hard constrained.
   * A value of 1 fully corrects offset each frame.
   * @param {number} d - The 0-1 damping constant, where 0 is unconstrained and 1 is hard drag.
   * A value of 1 fully damps relative velocity each frame.
   * @param {number} l - The target displacement of the spring (distance between bodies with the offsets applied).
   */


  setKDL(k, d, l) {
    this.k = k;
    this.d = d;
    this.l = l;
    this.recalculateConstants();
    return this;
  }
  /**
   * @param {Phaser.GameObjects.GameObject} [go] - The object to affect with the spring. Symmetric with setB.
   * @param {Phaser.Math.Vector2} [offset] - The offset of go's `x` and `y` coordinate to attach the spring.
   */


  setA(go, offset) {
    this._a = go;
    this.aOffset = offset || this.aOffset || kCenter;
    this.recalculateConstants();
    return this;
  }

  get a() {
    return this._a;
  }

  set a(v) {
    this.setA(v);
  }
  /**
   * @param {Phaser.GameObjects.GameObject} [go] - The object to affect with the spring. Symmetric with setA.
   * @param {Phaser.Math.Vector2} [offset] - The offset of go's `x` and `y` coordinate to attach the spring.
   */


  setB(go, offset) {
    this._b = go;
    this.bOffset = offset || this.bOffset || kCenter;
    this.recalculateConstants();
    return this;
  }

  get b() {
    return this._b;
  }

  set b(v) {
    return this.setB(v);
  }
  /** @return A's position plus its offset. */


  get aPos() {
    return this.scratch.setTo(this.a.body.x + this.aOffset.x * this.a.body.width, this.a.body.y + this.aOffset.y * this.a.body.height);
  }
  /** @return B's position plus its offset. */


  get bPos() {
    return this.scratch.setTo(this.b.body.x + this.bOffset.x * this.b.body.width, this.b.body.y + this.bOffset.y * this.b.body.height);
  }
  /** Internal; recalculates mass and motility of components. */


  recalculateConstants() {
    if (!this.a || !this.b) {
      return;
    }

    if (!this.a.body) {
      // console.warn('Setting unbodied game object', this.a);
      return;
    }

    if (!this.b.body) {
      // console.warn('Setting unbodied game object', this.b);
      return;
    }

    this.aFixed = this.a.body.immovable || this.a.body.pushable !== undefined && !this.a.body.pushable;
    this.bFixed = this.b.body.immovable || this.b.body.pushable !== undefined && !this.b.body.pushable;
    this.aMass = this.aFixed ? 0 : this.a.body.mass;
    this.bMass = this.bFixed ? 0 : this.b.body.mass;
    const productMass = this.aMass * this.bMass || this.aMass || this.bMass || 1;
    const sumMass = this.aMass + this.bMass || 1;
    this.reducedMass = (productMass || 1) / (sumMass || 1); // console.log('Reduced mass:', this.aMass, '&', this.bMass, '=', this.reducedMass);
  }
  /** Teleports A so that the anchors overlap. Doesn't use body; intended to be called on an object. */


  emplaceA() {
    this.a.x = this.b.x + this.bOffset.x * this.b.body.width - this.aOffset.x * this.a.width;
    this.a.y = this.b.y + this.bOffset.y * this.b.body.height - this.aOffset.y * this.a.height;
  }
  /** Teleports B so that the anchors overlap. Doesn't use body; intended to be called on an object. */


  emplaceB() {
    this.b.x = this.a.x + this.aOffset.x * this.a.body.width - this.bOffset.x * this.b.width;
    this.b.y = this.a.y + this.aOffset.y * this.a.body.height - this.bOffset.y * this.b.height;
  }

  apply(delta) {
    if (!this.prepare(delta)) {
      return;
    }

    this.execute();
  }

  prepare(delta) {
    const seconds = delta / 1000; // It's in millis.

    this.impulse = 0;
    this.length = 0;

    if (!this.a || !this.b) {
      return false;
    }

    if (!this.a.body || !this.b.body) {
      console.warn('Physics body not enabled for one of', this.a, this.b);
      return false;
    }

    if (this.aFixed && this.bFixed) {
      console.warn('Spring between two fixed objects', this.a, this.b);
      return false;
    } // See https://www.gamedev.net/tutorials/programming/math-and-physics/towards-a-simpler-stiffer-and-more-stable-spring-r3227/        
    // I believe there's a bug in that article, and the impulse line should read:
    //   J[linear] = -m[reduc]/deltaT * C[k]*x - m[reduc] * C[d]*v
    // as that makes physical sense.


    this.displacement.setFromObject(this.bPos).subtract(this.aPos);
    this.length = this.displacement.length();
    this.lX = Math.abs(this.displacement.x);
    this.lY = Math.abs(this.displacement.y);

    if (this.length < .000001) {
      // You want l=10 units but it's bPos=10e-10 away from aPos. We don't know which direction to go, too much like dividing by 0.
      this.length = 0;
      return false;
    }

    this.displacement.normalize();
    const relativeVelocity = this.displacement.dot(this.scratch.setFromObject(this.b.body.velocity).subtract(this.a.body.velocity));
    this.impulse = this.reducedMass * (1 / seconds * this.k * (this.length - this.l) + this.d * relativeVelocity); // Maybe I should rename this, since it's kind of a bad name.

    this.displacement.setLength(this.impulse); // And this in particular does us no favors...: this.impulse /= this.reducedMass;
    // console.groupEnd();

    return true;
  }

  execute() {
    // Now: apply.
    if (!this.aFixed) {
      this.displacement.setLength(this.impulse / this.aMass);
      this.a.body.velocity.add(this.displacement);
    }

    if (!this.bFixed) {
      this.displacement.setLength(-this.impulse / this.bMass);
      this.b.body.velocity.add(this.displacement);
    }
  }

}

exports.default = Spring;
const kCenter = new Phaser.Math.Vector2(.5, .5);