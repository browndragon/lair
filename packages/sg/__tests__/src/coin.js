import Phaser from 'phaser';
import SG from '@browndragon/sg';

export default class Coin extends SG.Member(
    Phaser.Physics.Arcade.Image,
    class extends SG.PGroup {
        static get overlaps() { return [Coin.Collides] }
        static overlap(coin, player) {
            coin.collect();
            player.getCoin(coin.value);
        }
    },
) {
    constructor(scene, x, y, value) {
        super(scene, x, y, `coin${value}`);
        this.value = value;
    }
    addedToScene() {
        super.addedToScene();
        this.depth = -1;
        this.scene.tweens.add({
            targets: this,
            scaleX: {value:.125, yoyo:true, repeat:60, duration:500, ease: 'Sine.easeInOut'},
            onComplete: () => {
                if (!this.scene) {
                    return;
                }
                this.collect();
            },
        });
    }
    collect() {
        // Doesn't modify score; player does that.
        this.body.setEnable(false);
        this.scene.tweens.add({
            targets: this,
            duration: 500,
            props: {
                y: {value:this.y - this.height, duration:500, ease: 'Linear'},
                scaleY: {value:0, duration:500, ease: 'Bounce'},
            },
            onComplete: () => {
                if (!this.scene) {
                    return;
                }
                this.destroy();
            },
        });
    }
}
Coin.Collides = class extends SG.PGroup {}
Coin.preload = function(scene) {
    const tmpl = {pixelWidth: 2, pixelHeight: 2};
    scene.textures.generate('coin1', {...tmpl, data:`
        .2222.
        277672
        277672
        276772
        276772
        .2222.
    `.split('\n').map(s => s.trim()).filter(Boolean)});
    scene.textures.generate('coin5', {...tmpl, data:`
        ..2222..
        .2FFFF2.
        21F11112
        21FFF112
        21111F12
        21111F12
        .2FFFF2.
        ..2222..
    `.split('\n').map(s => s.trim()).filter(Boolean)});
    scene.textures.generate('coin10', {...tmpl, data:`
        .2222.
        2F11F2
        21FF12
        21FF12
        2F11F2
        .2222.
    `.split('\n').map(s => s.trim()).filter(Boolean)});
    scene.textures.generate('coin25', {...tmpl, data:`
        ..222222..
        .21111112.
        21FF1FFFF2
        2F11FF1112
        211F11FF12
        21F11111F2
        2F111111F2
        2FFFF1FF12
        .21111112.
        ..222222..
    `.split('\n').map(s => s.trim()).filter(Boolean)});
};