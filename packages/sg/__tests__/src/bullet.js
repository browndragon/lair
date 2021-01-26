import Phaser from 'phaser';
import SG from '@browndragon/sg';

import Mob from './mob';

export default class Bullet extends SG.Member(
    Phaser.Physics.Arcade.Image, 
    class extends SG.PGroup {
        constructor(...params) {
            super(...params);
            this.scene.physics.world.on('worldbounds', bullet => {
                if (!(bullet.gameObject instanceof Bullet)) {
                    return;
                }
                if (!bullet.gameObject.scene) {
                    return;
                }
                bullet.gameObject.destroy();
            }, this);
        }
        destroy(...params) {
            this.scene.physics.world.off('worldbounds', undefined, this);
            super.destroy(...params);
        }
        static get overlaps() { return [Mob.LastGroup] }
        static overlap(bullet, target) {
            if (bullet.parent == target) {
                return;
            }
            target.getHurt(bullet.parent.bulletdamage);
            bullet.destroy();
        }
    },
) {
    constructor(parent, x, y) {
        super(parent.scene, x, y, `bullet`);
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