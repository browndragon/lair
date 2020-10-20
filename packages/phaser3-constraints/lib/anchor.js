"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

// import Phaser from 'phaser';

/**
 * A standin for a position & velocity bodies in this library.
 * It's mostly very similar to Arcade Physics Body, but since it has an additional offset, it attaches to a specific point somewhere on a physics body.
 */
class Anchor {
  /**
   * @param {
   *  Phaser.Types.Math.Vector2Like
   * |Phaser.GameObjects.GameObject
   * |Phaser.Physics.Arcade.Body
   * } object - The body being tracked. If unset, [0, 0]. Prefers the arcade body (if any).
   * @param {Phaser.Types.Math.Vector2Like=} offset - Optional offset within the `object` to anchor the point mass. If unset, uses the center of the `object`.
   */
  constructor(object, offset = undefined) {
    if (object instanceof Anchor) {
      object = object.object;
    }

    this._object = object;
    this._offset = offset ? new Phaser.Math.Vector2(offset) : offset;
  }

  static ensure(obj, offset) {
    if (!obj && !offset) {
      throw new TypeError();
    }

    if (obj instanceof Anchor) {
      if (offset === undefined) {
        return obj;
      }

      if (obj._offset == offset) {
        return obj;
      }

      if (obj._offset && offset) {
        if (obj._offset.x == offset.x && obj._offset.y == offset.y) {
          return obj;
        }
      }
    }

    return new Anchor(obj, offset);
  }

  get object() {
    return this._object;
  }

  get position() {
    let cursor = this._object;

    if (!cursor) {
      return this._offset;
    }

    if (cursor.body) {
      cursor = cursor.body;
    }

    if (!this._offset && cursor.center) {
      cursor = new Phaser.Math.Vector2(cursor.center);
    } else if (cursor.position) {
      cursor = new Phaser.Math.Vector2(cursor.position);
    } else
      /* cursor has x & y itself */
      {
        cursor = new Phaser.Math.Vector2(cursor);
      }

    if (this._offset) {
      cursor = cursor.add(this._offset);
    }

    console.assert(Number.isFinite(cursor.x));
    console.assert(Number.isFinite(cursor.y));
    return cursor;
  }

  get width() {
    return this.constructor.width(this._object);
  }

  static width(cursor) {
    if (!cursor) {
      return 0;
    }

    if (cursor.body) {
      cursor = cursor.body;
    }

    return cursor.width;
  }

  get height() {
    return this.constructor.height(this._object);
  }

  static height(cursor) {
    if (!cursor) {
      return 0;
    }

    if (cursor.body) {
      cursor = cursor.body;
    }

    return cursor.height;
  }

  get velocity() {
    let cursor = this._object;

    if (!cursor) {
      return undefined;
    }

    if (cursor.body) {
      cursor = cursor.body;
    }

    if (!cursor.velocity) {
      return undefined;
    }

    return new Phaser.Math.Vector2(cursor.velocity);
  }

  relative(other) {
    other = this.constructor.ensure(other);
    return [this.position.subtract(other.position), this.velocity.subtract(other.velocity)];
  }
  /** Scales the rPos vector to the component in the rVeloc direction. */


  static project(rPos, rVeloc) {
    rPos.normalize();
    rPos.scale(rVeloc.dot(rPos));
    return rPos;
  }

}

exports.default = Anchor;