// import Phaser from 'phaser';

/** A standin for a position, velocity, and mass. */
export default class PointMass {
    constructor(object, offset=undefined, mass=undefined) {
        if (object instanceof PointMass) {
            object = object.object;
        }
        this._object = object;
        this._offset = offset;
        this._mass = mass;
    }
    static ensure(obj, offset) {
        if (obj == undefined) {
            throw new TypeError();
        }
        if (obj instanceof PointMass) {
            // TODO: Handle checking offset matches.
            return obj;
        }
        return new PointMass(obj);
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