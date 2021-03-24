import Phaser from 'phaser';
import SG from '@browndragon/sg';

import Shadows from './shadows';

export const game = new Phaser.Game({
    type: Phaser.WEBGL,
    width: 400,
    height: 300,
    scene: [ class extends Phaser.Scene {
        constructor() {
            super({
                key:'Game',
                physics: {
                    arcade: { debug: false },
                }
            });
        }
        create() {
            // Create a blob which tracks the mouse and then fades after mouseup.
            this.input.on('pointerdown', (pointer, ...params) => {
                this.add.existing(new Pointer(this, pointer.x, pointer.y));
            });
            this.input.on('pointerup', (pointer, ...params) => {
                // Just a pun for the Pointer group.
                let group = Shadows.group(this);
                for (let child of group.getChildren()) {
                    child.destroy();
                }
            });
        }
        update(time, delta) {
            let group = Shadows.group(this);
            for (let child of group.getChildren()) {
                // Follow the cursor...
                let offset = new Phaser.Math.Vector2(this.input.x - child.x, this.input.y - child.y);
                offset.scale(delta / 250);
                offset.limit(256);
                child.x += offset.x;
                child.y += offset.y;
            }
        }
    }],
});

class Pointer extends SG.Member(Phaser.GameObjects.Ellipse, Shadows) {
    addedToScene() {
        super.addedToScene();
        this.scene.physics.add.existing(this);
        this.setFillStyle(0x0000BB);
        this.setScale(.45);
        this.setAlpha(.5);
        this.setDepth(1);
        this.scene.tweens.add({
            targets: this,
            scale: .55,
            yoyo: true,
            duration: 500,
            repeat: -1,
        });
    }
}
