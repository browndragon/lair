import Phaser from 'phaser';

import test from './test';

export const game = new Phaser.Game({
    type: Phaser.WEBGL,
    width: 400,
    height: 300,
    parent: 'phaser-example',
    scene: [ class extends Phaser.Scene {
        constructor() {
            super({
                key:'Game',
            });
        }
        preload() {
            test.preloadScene(this);
        }
        create() {
            this.label = this.add.text(150, 0, '???');
            this.cursorKeys = this.input.keyboard.createCursorKeys();

            this.types = circle(test.assetTypes());
            this.typek = this.types.next().value;
            this.entries = circle(test.assetsOfType(this.typek));
            this.resetGameObject();
        }
        update(time, delta) {
            if (this.input.keyboard.checkDown(this.cursorKeys.space, 250)) {
                this.typek = this.types.next().value;
                this.entries = circle(test.assetsOfType(this.typek));
                this.resetGameObject();
                return;
            }
            if (this.input.keyboard.checkDown(this.cursorKeys.shift, 250)) {
                this.resetGameObject();
                return;
            }
            if (this.typek == 'spritesheet') {
                let offset = 0;
                if (this.input.keyboard.checkDown(this.cursorKeys.right, 250)) {
                    offset++;
                } else if (this.input.keyboard.checkDown(this.cursorKeys.left, 250)) {
                    offset--;
                }
                if (offset == 0) {
                    return;
                }

                const currentFrame = +this.go.frame.name;
                if (!Number.isFinite(currentFrame)) {
                    console.warn("Can't nextframe", currentFrame);
                    return;
                }
                const nextFrame = Phaser.Math.Wrap(currentFrame + offset, 0, this.go.texture.frameTotal - 1);
                if (nextFrame != currentFrame) {
                    this.go.setFrame(nextFrame);
                }
            }
        }
        resetGameObject() {
            if (this.go) {
                this.go.destroy();
                this.go = undefined;
            }
            const assetName = this.entries.next().value;
            this.label.text = `${this.typek}:${assetName}`;
            switch (this.typek) {
                case 'animation': {
                    this.go = this.add.sprite(200, 200);
                    this.go.play(test.asset(assetName));
                }; break;
                case 'image': {
                    this.go = this.add.image(200, 200, test.asset(assetName));
                }; break;
                case 'spritesheet': {
                    this.go = this.add.image(200, 200, test.asset(assetName), 0);
                }; break;
                default: throw 'undefined';
            }
        }
    }],
});

function* circle(arr) {
    while (true) {
        for (let v of arr) {
            yield v;
        }
    }
}