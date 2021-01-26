import Phaser from 'phaser';
import SG from '@browndragon/sg';

import Coin from './coin';
import Mob from './mob';

export default class Enemy extends Mob {
    constructor(scene, x, y) {
        super(scene, x, y, 'enemy');
        this.hp = 2;
        this.scene.sys.registry.inc('alive');
        this.scene.sys.registry.inc('alltime');
    }
    addedToScene() {
        super.addedToScene();
        this.randomWalk(0);
        this.spawnCoin();
        this.bulletdamage += .25 * Math.floor(this.scene.sys.registry.values.alltime / 25);
    }
    randomWalk() {
        if (!this.scene) {
            return;
        }
        if (Phaser.Math.Between(1, 3) == 1) {
            this.spawnBullet();
        }
        Phaser.Math.RandomXY(this.body.velocity, 60);
        this.walk = this.scene.time.delayedCall(Phaser.Math.Between(750, 2000), () => this.scene && this.randomWalk());
    }
    getHurt(damage) {
        if (!this.scene) {
            return;
        }
        super.getHurt(damage);
        this.hp -= damage;
        if (this.hp <= 0) {
            this.spawnCoin();
            this.scene.sys.registry.inc('killed');
            this.body.setEnable(false);
            this.scene.tweens.add({
                targets: this,
                rotation: {from:0, to: 2 * Math.PI},
                repeat: 1,
                duration: 125,
                onComplete: () => this.destroy()
            });
            return;
        }
        // Randomize either way, it looks cool.
        Phaser.Math.RandomXY(this.body.velocity, 60);
    }
    preDestroy(...params) {
        super.preDestroy(...params);        
    }
    destroy(...params) {
        super.destroy(...params);
    }
    stopHurt() {
        super.stopHurt();
        this.randomWalk();
    }
    spawnCoin() {
        let rnd = Phaser.Math.Between(1, 15);
        let val = 0;
        if (rnd <= 1) {
            val = 25;
        } else if (rnd <= 3) {
            val = 10;
        } else if (rnd <= 7) {
            val = 5;
        } else if (rnd <= 15) {
            val = 1;
        } else {
            console.assert(false);
        }
        let coin = new Coin(this.scene, this.x, this.y, val);
        this.scene.add.existing(coin);
        this.coin = this.scene.time.delayedCall(2000 + Phaser.Math.FloatBetween(0, 1000) * val, () => this.scene && this.spawnCoin());
        return coin;
    }
}
Enemy.preload = function(scene) {
    const tmpl = {pixelWidth: 2, pixelHeight: 2};
    // scene.textures.generate('enemy', {...tmpl, data:`
    //     ....4444....
    //     .C.44FF44...
    //     ..C4....44..
    //     .44CC....44.
    //     44..CC.BB.44
    //     44...CCBBB44
    //     44...CCBBB44
    //     44..CC.BB.44
    //     .44CC....44.
    //     ..C4....44..
    //     .C.44FF44...
    //     ....4444....
    // `.split('\n').map(s => s.trim()).filter(Boolean)})
    scene.textures.generate('enemy', {...tmpl, data:`
        ....3333..3.
        ..0334433333
        ..30444320..
        .3340434403.
        334440244033
        334430044033
        334430044033
        334440244033
        .3340434203.
        ..30444330..
        ..0334433333
        ....3333..3.
    `.split('\n').map(s => s.trim()).filter(Boolean)})

}