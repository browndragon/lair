import Phaser from 'phaser';
import SG from '@browndragon/sg';
import UV from '@browndragon/uv';
import {Matrix} from '@browndragon/store';

import Conformers from './conformers';

/** A Pool manages instances of its internal class similar to a tilemap(/layer); using setTileGeometry results in a grid offset, and setConformer allows specializing each `tile` value.
 * These have assumed locations! Like, if you modify x & y on these things, attempts to put/remove will use the location they had when they were first created.
 */
export default class Pool extends SG.Group {
    constructor(...params) {
        super(...params);
        this.tiledata = new Matrix();
        this.setTileGeometry().setConformer(new.target.DefaultConformer);
    }
    setTileGeometry(tileWidth, tileHeight, offsetX, offsetY) {
        this.uv = new UV(tileWidth, tileHeight, offsetX, offsetY);
        return this;
    }
    setConformer(conformer) {
        console.assert(conformer);
        this.tileconformer = conformer;
        return this;
    }
    peekTileUV(u, v) {
        return this.tiledata.get(u, v);
    }
    /** Tile 'undefined' deletes. */
    putTileUV(tile, u, v) {
        let entry = this.tiledata.get(u, v);
        if (!entry) {
            entry = {go:this.prepareTileGameObject(u, v), u, v};
            this.tiledata.set(u, v, entry);
        }
        let oldTile = entry.tile;
        entry.tile = tile;
        this.tileconformer(entry, oldTile);
        return this;
    }

    prepareTileGameObject(u, v) {
        const [x, y] = this.uv.xy(u, v);
        // Fetch-cached or create-new & undo any previous killandhide
        let go = this.get(x, y, this.defaultKey, this.defaultFrame);
        go.setActive(true).setVisible(true);
        return go;
    }

    removeTileUV(u, v) {
        let member = this.tiledata.pop(u, v);
        if (member && member.go) {
            this.killAndHide(member.go);
        }
        return this;
    }
    *getTilesWorld(x, y, w, h) {
        const [uMin, vMin, uCount, vCount] = this.uv.uvBounds(x, y, w, h);
        for (let v = 0; v < vCount; ++v) {
            for (let u = 0; u < uCount; ++u) {
                const tile = this.tiledata.get(uMin + u, vMin + v);
                if (tile) {
                    yield tile;
                }
            }
        }
    }
    getAllTiles() {
        return this.tiledata.values();
    }
}
Pool.DefaultConformer = Conformers.LiteralFrame;