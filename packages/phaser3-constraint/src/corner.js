// import Phaser from 'phaser';
import P3P from '@browndragon/phaser3-plugin';
import Cluster from './cluster';
import {PointMass} from './force';
import Pair from './pair';


/**
 * Constraints 0-4 bodies by a fixed corner for each, maintaining orientation.
 *
 * This can be used to hold bodies together in a grid pattern.
 *
 * The names are a little unintuitive; they refer to the corners which are bound (so are 180 off from reality).
 */
export default class Corner extends Cluster {
    /** `center` is the center of the bond, which is the corner of each tile. */
    constructor(parent, center, force) {
        super(parent, center, force);
        // A little unintuitive; these names refer to the bound corners on the OTHER body which are always bound to our own center, so.
        this.vs = {
            ne: undefined;
            se: undefined;
            sw: undefined;
            nw: undefined;
        };
    }

    get ne() { return this.vs.ne }
    get se() { return this.vs.se }
    get sw() { return this.vs.sw }
    get nw() { return this.vs.nw }
    _set(tag, value) {
        value[TAG] = tag;
        const old = this.vs[tag];
        if (old) {
            old.stop();
        }
        this.vs[tag] = value;
        super.existing(value);
    }
    set ne(v) {
        this._set('ne', v);
    }
    set se(v) {
        this._set('se', v);
    }
    set sw(v) {
        this._set('sw', v);
    }
    set nw(v) {
        this._set('nw', v);
    }

    create({target, atCorner}) {
        console.assert(target);
        const w = target.body.width;
        const h = target.body.height;
        let constraint = undefined;
        switch (atCorner) {
            case 'ne': 
                constraint = new Pair(this,
                    this.center, new PointMass(target, {x:w, y:0}), this.force,
                );
                break;
            case 'se':
                constraint = new Pair(this,
                    this.center, new PointMass(target, {x:w, y:h}), this.force,
                );
                break;
            case 'sw':
                constraint = new Pair(this,
                    this.center, new PointMass(target, {x:0, y:h}), this.force,
                );
                break;
            case 'nw':
                constraint = new Pair(this,
                    this.center, new PointMass(target, {x:w, y:0}), this.force,
                );
                break;
            default:
                throw new TypeError();            
        }
        constraint[TAG] = atCorner;
        return constraint;
    }

    existing(constraint) {
        switch (constraint[TAG]) {
            case 'ne':
                this.ne = constraint;
                break;
            case 'se':
                this.se = constraint;
                break;
            case 'sw':
                this.sw = constraint;
                break;
            case 'nw':
                this.nw = constraint;
                break;
            default:
                throw new TypeError();
        }
    }
}
const TAG = Symbol('Tag');
