// import Phaser from 'phaser';

/** A standin for a position, velocity, and mass. */
export default class PointMass {
    /**
     * @param {
     *  Phaser.Types.Math.Vector2Like
     * |Phaser.GameObjects.GameObject
     * |Phaser.Physics.Arcade.Body
     * } object - The body being tracked. If unset, [0, 0]. Prefers the arcade body (if any).
     * @param {Phaser.Types.Math.Vector2Like=} offset - Optional offset within the `object` to anchor the point mass. If unset, uses the center of the `object`.
     * @param {number=} mass - Mass to use for this object if set, otherwise, mass from the `object` or its body.
     */
    constructor(object, offset=undefined, mass=undefined) {
        if (object instanceof PointMass) {
            object = object.object;
        }
        this._object = object;
        this._offset = offset ? new Phaser.Math.Vector2(offset) : offset;
        this._mass = mass;
    }
    static ensure(obj, offset) {
        if (!obj && !offset) {
            throw new TypeError();
        }
        if (obj instanceof PointMass) {
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
        return new PointMass(obj, offset);
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
        } else /* cursor has x & y itself */ {
            cursor = new Phaser.Math.Vector2(cursor);
        }

        if (this._offset) {
            cursor = cursor.add(this.offset);
        }

        console.assert(Number.isFinite(cursor.x));
        console.assert(Number.isFinite(cursor.y));
        return cursor;
    }
    get velocity() {
        let cursor = this._object;
        if (!cursor) {
            return undefined;
        }
        if (!cursor.body) {
            return undefined;
        }
        return new Phaser.Math.Vector2(cursor.body.velocity);
    }
    get mass() {
        if (this._mass != undefined) {
            return this._mass;
        }
        if (this.object == undefined) {
            return undefined;
        }
        if (this.object.body == undefined) {
            return undefined;
        }
        return this.object.body.mass;
    }
}
