const Order = ['ne', 'se', 'sw', 'nw'];

const S = Symbol('Corners');

// Ugh. Can we/should we drop this?
export default {
    toId({ne, se, sw, nw}) {
        return (
            0
            + (+!!ne << this.BitPos.ne)
            + (+!!se << this.BitPos.se)
            + (+!!sw << this.BitPos.sw)
            + (+!!nw << this.BitPos.nw)
        );
    },
    debug(id) {
        let retval = {};
        if (v & (1 << this.BitPos.ne)) { retval.ne = true }
        if (v & (1 << this.BitPos.se)) { retval.se = true }
        if (v & (1 << this.BitPos.sw)) { retval.sw = true }
        if (v & (1 << this.BitPos.nw)) { retval.nw = true }
        return retval;
    },
    Order,
    BitPos: Object.fromEntries(Order.map((v, i) => [v, i])),
    Empty: Object.fromEntries(Order.map(v => [v, undefined])),
    Offsets: {
        ne: new Phaser.Math.Vector2(1, 0),
        se: new Phaser.Math.Vector2(1, 1),
        sw: new Phaser.Math.Vector2(0, 1),
        nw: new Phaser.Math.Vector2(0, 0),
        center: new Phaser.Math.Vector2(.5, .5),
    },
    Opposites: {
        ne: 'sw',
        se: 'nw',
        sw: 'ne',
        nw: 'se',
    },
    Store(clazz) {
        if (clazz[S]) {
            return clazz;
        }
        return class extends clazz {
            static get [S]() { return true }
            get ne() { return this.getCorner('ne') }
            get se() { return this.getCorner('se') }
            get sw() { return this.getCorner('sw') }
            get nw() { return this.getCorner('nw') }
            set ne(v) { return this.setCorner('ne', v) }
            set se(v) { return this.setCorner('se', v) }
            set sw(v) { return this.setCorner('sw', v) }
            set nw(v) { return this.setCorner('nw', v) }
        };
    }
};
