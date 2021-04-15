import Phaser from 'phaser';
import SG from '@browndragon/sg';

import Bullet from './bullet';
import Mob from './mob';
import Gate from './gate';

// Tile size.
const ts = 16;

// Dimensions for the rooms generated.
const SMOL = 12;
const HSMOL = 4;
const NWINDOW = 2;
const XWINDOW = 8;

// Badly named; this is really all sorts of tile info.
export default class Wall {
    static handler(gid, tileset) {
        // Invoked explicitly by our tile colliding groups to keep the logic self contained.
        if (/wall.*/.test(tileset.name)) { return collideOnly }
        return undefined;
    }
    static generate(scene) {
        let map = scene.add.tilemap(undefined,
            ts,ts,
            Math.floor(scene.cameras.main.width / ts),
            Math.floor(scene.cameras.main.height / ts)
        );

        // This is really part of some "floor" lgroup, but we know nobody collides with it.
        let floorgid = 0;
        let floors = [];
        for (let i = 0; i < 5; ++i) {
            floors.push(floorgid);
            map.addTilesetImage(`floor${i}`, undefined, undefined, undefined, undefined, undefined, floorgid++);
        }

        // Now! Real local walls!
        let wallgid = floorgid;
        let walls = [];
        let wallTilesets = [];

        for (let i = 0; i < 6; ++i) {
            walls.push(wallgid);
            wallTilesets.push(map.addTilesetImage(`wall${i}`, undefined, undefined, undefined, undefined, undefined, wallgid++));
        }

        let layer = map.createBlankLayer('layer', map.tilesets);
        layer.setDepth(-1);
        // Cover the arena.
        map.randomize(0, 0, map.width, map.height, floors);
        // Strew it with walls.
        makeLabyrinth(map, 0, 0, map.width, map.height, floors, walls);
        // Bound the whole arena.
        outlineRect(map, 0, 0, map.width, map.height, walls);

        SG.tilemap(map, Bullet.LastGroup, Mob.LastGroup);

        // Collide all walltiles against the things they're supposed to collide against. This accepts multiple tilesets for the same piece of collision logic.
        // this.initLayer(layer, true);
        // Internal recalculate etc.
        // This *must* be last, because if you do it earlier apparently recalculateTiles doesn't work, and so the actual tiledefs don't match.
        // map.setCollision(walls);

        // // Tell people to bounce off of walls.
        // scene.physics.add.collider(
        //     // No actions, just bounce, it's fine.
        //     Mob.LastGroup.group(scene),
        //     layer,  // NOT map.getLayer(), which is a layerdata.
        // );
        // // Tell bullets to die on walls & degrade the wall.
        // scene.physics.add.collider(
        //     // To avoid confusion, the layer needs to be the second element -- because internal collision logic reorders collisions to ensure that.
        //     Bullet.LastGroup.group(scene),
        //     layer,
        //     (bullet, tile) => {
        //         bullet.destroy();
        //         let layer = tile.layer.tilemapLayer;
        //         layer.putTileAt(tile.index - 1, tile.x, tile.y);
        //     }
        // );
        return map;
    }
}

function last(arr) {
    return arr[arr.length - 1];
}

function outlineRect(map, x, y, w, h, allwalls) {
    const walls = allwalls.slice(0, allwalls.length - 1);
    let mx = x+w-1;
    let my = y+h-1;
    map.randomize(x, y, w, 1, walls);
    map.randomize(x, y, 1, h, walls);
    map.randomize(mx, y, 1, h, walls);
    map.randomize(x, my, w, 1, walls);
    const lw = last(allwalls);
    map.putTileAt(lw, x, y);
    map.putTileAt(lw, mx, y);
    map.putTileAt(lw, x, my);
    map.putTileAt(lw, mx, my);
}
function outlineTopLeft(map, x, y, w, h, floors, allwalls) {
    const walls = allwalls.slice(0, allwalls.length - 1);
    let mx = x+w;
    let my = y+h;
    map.randomize(x, y, w, 1, walls);
    map.randomize(x, y, 1, h, walls);
    const lw = last(allwalls);
    map.putTileAt(lw, x, y);
    map.putTileAt(lw, mx, y);
    map.putTileAt(lw, x, my);

    const along = h + w;
    const mindim = Math.min(w, h);    
    for (
        let i = Phaser.Math.Between(0, along), mi = i;
        i >= mi && (mi = i || true);
        i = Phaser.Math.Between(0, along)
    ) {
        let s = Phaser.Math.Between(NWINDOW, Math.min(mindim, XWINDOW));
        let ix = 0, iy = 0, iw = s, ih = s;
        if (i < h) {
            ix = x;
            iy = y + i - Math.floor(s/2);
            iw = 1;
            ih = s;
            i = i + Math.floor(s/2);
        } else {
            ix = x + (i - h) - Math.floor(s/2);
            iy = y;
            iw = s;
            ih = 1;
            i = i + Math.floor(s/2);
        }
        map.randomize(ix, iy, iw, ih, floors);
    }
}

function makeLabyrinth(map, x, y, w, h, floors, walls) {
    // Degenerate. It's fine, ignore; this is the base case every other case spits out.
    if (w <= 0 || h <= 0) {
        return;
    }
    let nx = w <= SMOL ? x : Phaser.Math.Between(x + HSMOL, x+w-HSMOL);
    let ny = h <= SMOL ? y : Phaser.Math.Between(y + HSMOL, y+h-HSMOL);
    let ow = nx - x;
    let oh = ny - y;
    let nw = w - ow;
    let nh = h - oh;
    // Base case: we're small enough to just draw the room.
    if (nw == w && nh == h) {
        outlineTopLeft(map, nx, ny, nw, nh, floors, walls);
        return;
    }
    makeLabyrinth(map, x, y, ow, oh, floors, walls);
    makeLabyrinth(map, nx, y, nw, oh, floors, walls);
    makeLabyrinth(map, x, ny, ow, nh, floors, walls);
    makeLabyrinth(map, nx, ny, nw, nh, floors, walls);
}
Wall.preload = function(scene) {
    const tmpl = {pixelWidth:4, pixelHeight:4};
    scene.textures.generate('floor0', {...tmpl, data:`
        8888
        8888
        8888
        8888
    `.split('\n').map(s => s.trim()).filter(Boolean)});
    scene.textures.generate('floor1', {...tmpl, data:`
        8888
        8788
        8888
        8888
    `.split('\n').map(s => s.trim()).filter(Boolean)});
    scene.textures.generate('floor2', {...tmpl, data:`
        8888
        8878
        8888
        8888
    `.split('\n').map(s => s.trim()).filter(Boolean)});
    scene.textures.generate('floor3', {...tmpl, data:`
        8888
        8888
        8878
        8888
    `.split('\n').map(s => s.trim()).filter(Boolean)});
    scene.textures.generate('floor4', {...tmpl, data:`
        8888
        8888
        8788
        8888
    `.split('\n').map(s => s.trim()).filter(Boolean)});
    scene.textures.generate('wall0', {...tmpl, data:`
        6666
        6776
        6776
        6666
    `.split('\n').map(s => s.trim()).filter(Boolean)});
    scene.textures.generate('wall1', {...tmpl, data:`
        8666
        6676
        6776
        6666
    `.split('\n').map(s => s.trim()).filter(Boolean)});
    scene.textures.generate('wall2', {...tmpl, data:`
        6668
        6766
        6776
        6666
    `.split('\n').map(s => s.trim()).filter(Boolean)});
    scene.textures.generate('wall3', {...tmpl, data:`
        6666
        6776
        6766
        6668
    `.split('\n').map(s => s.trim()).filter(Boolean)});
    scene.textures.generate('wall4', {...tmpl, data:`
        6666
        6776
        6676
        8666
    `.split('\n').map(s => s.trim()).filter(Boolean)});
    scene.textures.generate('wall5', {...tmpl, data:`
        8668
        6666
        6666
        8668
    `.split('\n').map(s => s.trim()).filter(Boolean)});
}