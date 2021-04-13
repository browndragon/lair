import Phaser from 'phaser';
import SG from '@browndragon/sg';

import Mob from './mob';
import Wall from './wall';

export default class Bullet extends SG.Member(
    Phaser.Physics.Arcade.Image,
    Wall,
    class extends SG.Overlap {
        constructor(...params) {
            super(...params);
            this.scene.physics.world.on('worldbounds', bullet => {
                if (!(bullet.gameObject instanceof Bullet)) { return }
                if (!bullet.gameObject.scene) { return }
                bullet.gameObject.destroy();
            }, this);
        }
        destroy(...params) {
            this.scene.physics.world.off('worldbounds', undefined, this);
            super.destroy(...params);
        }
        get intersects() { return [Mob.LastGroup] }
        intersect(bullet, target) {
            if (bullet.parent == target) {
                return;
            }
            target.getHurt(bullet.parent.bulletdamage);
            bullet.destroy();
        }
        tileHandler(gid, tileset) {
            if (Wall.handler(gid, tileset)) { return this.onWall }
            return undefined;
        }
        onWall(bullet, tile) {
            bullet.destroy();
            let layer = tile.layer.tilemapLayer;
            layer.putTileAt(tile.index - 1, tile.x, tile.y);
        }
    },
) {
    constructor(scene, x, y, parent) {
        super(scene, x, y, `bullet`);
        this.parent = parent;
    }
    addedToScene() {
        super.addedToScene();
        this.body.setCircle(this.body.halfWidth);
        this.body.setCollideWorldBounds();
        this.body.onWorldBounds = true;
        this.setDepth(+1);
    }
}
Bullet.preload = function(scene) {
    const tmpl = {pixelWidth: 2, pixelHeight: 2};
    scene.textures.generate('bullet', {...tmpl, data:`
        .4444.
        442244
        423324
        423324
        442244
        .4444.
    `.split('\n').map(s => s.trim()).filter(Boolean)});
}