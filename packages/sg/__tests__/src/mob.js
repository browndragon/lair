import Phaser from 'phaser';
import SG from '@browndragon/sg';

import Bullet from './bullet';
import Wall from './wall';

export default class Mob extends SG.Member(
    Phaser.Physics.Arcade.Sprite,
    Wall,
    class extends SG.PGroup {
        static get colliders() { return [this] }
        static collider(a, b) {
            let ahurt = a.hurting;
            let bhurt = b.hurting;
            if (!bhurt) { a.getHurt(b.touchdamage); }
            if (!ahurt) { b.getHurt(a.touchdamage); }
        }
    },
) {
    constructor(...params) {
        super(...params);
        this.hurting = undefined;
        this.bulletdamage = 1;
        this.touchdamage = .25;
    }
    onWall(tile) {}
    getHurt(damage) {
        if (this.hurting) {
            return false;
        }
        this.hurting = this.scene.tweens.addCounter({
            from: 0,
            to: 255,
            duration: 250,
            repeat: 1 + 2 * damage,
            onUpdate: (tween) => {
                const value = Math.floor(tween.getValue());
                this.setTintFill(Phaser.Display.Color.GetColor(value, value, value));
            },
            onComplete: () => this.stopHurt(),
        });
        return true;
    }
    stopHurt() {
        this.hurting = undefined;
        this.tintFill = false;
        this.clearTint();
    }
    spawnBullet() {
        let bullet = new Bullet(this, this.x, this.y, this);
        this.scene.add.existing(bullet);
        bullet.body.velocity.setToPolar(this.rotation, 200);
    }
    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        this.setRotationFromFacing();
    }
    addedToScene() {
        super.addedToScene();
        this.body.setCircle(this.body.halfWidth);
        this.body.setCollideWorldBounds();
        this.body.setBounce(1, 1);
        this.scene.tweens.add({
            targets: this,
            scaleX: {from: .875, to: 1.125},
            scaleY: {from: 1.125, to: .875},
            yoyo: true,
            duration: 1000,
            ease: 'Linear',
            repeat: -1,
        });
    }
    setRotationFromFacing() {
        if (this.body.velocity.lengthSq() <= 0) {
            return;
        }        
        this.rotation = this.body.velocity.angle();
    }
    destroy() {
        super.destroy();
    }
}
