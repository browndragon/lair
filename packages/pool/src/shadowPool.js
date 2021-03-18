import Phaser from 'phaser';
import SG from '@browndragon/sg';
import {Matrix} from '@browndragon/store';

import Pool from './pool';

/** A pool which watches some target group, ensuring that during our preupdate, their sprites deposit membership. */
export default class ShadowPool extends Pool {
    constructor(...params) {
        super(...params);
        this._shadowMap = new Matrix();
    }
    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        this._shadowMap.clear();

        const watchGroup = this.constructor.WatchGroup.group(this.scene);
        for (let member of watchGroup.getChildren()) {
            this.castShadows(member);
        }
        // The _shadowMap now holds the proper wangIds for every tile, so set 'em:
        for (let [[u, v], wangId] of this._shadowMap) {
            this.putTileUV(wangId, u, v);
        }
        // And then go through the set of tiles and remove those which aren't in the shadow map:
        for (let tile of this.getAllTiles()) {
            let tileValue = this._shadowMap.get(tile.u, tile.v);
            if (!tileValue) {
                this.putTileUV(undefined, tile.u, tile.v);
            }
        }
    }
    castShadows(member) {
        // Because we ensure that our shadow map resolution is at least 2x finer than our game object resolution, u/vCount should always be >2. If it isn't, then something can be both top & bottom (or left & right) under this math.
        let b = member.getBounds();
        let [uMin, vMin, uCount, vCount] = this.uv.uvBounds(b.x, b.y, b.width, b.height);
        uCount += 1;
        vCount += 1;
        for (let v = 0; v <= vCount; ++v) {
            const rowPattern = v <= 0 ? kTop : v >= vCount ? kBottom : kMiddle;
            for (let u = 0; u <= uCount; ++u) {
                const pattern = rowPattern & (u <= 0 ? kLeft : u >= uCount ? kRight : kMiddle);
                // Ensure this is (newly...) in the shadow map.
                this._shadowMap.bitwiseOr(uMin + u, vMin + v, pattern);
            }
        }
    }
}
ShadowPool.WatchGroup = class extends SG.Group {};

const kMiddle = 0b1111;
const kTop = 0b0110;
const kRight = 0b1100;
const kBottom = 0b1001;
const kLeft = 0b0011;