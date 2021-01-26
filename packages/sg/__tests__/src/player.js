import Phaser from 'phaser';
import SG from '@browndragon/sg';

import Coin from './coin';
import Gate from './gate';
import Mob from './mob';

export default class Player extends SG.Member(Mob, Coin.Collides, Gate.Collides) {
    constructor(scene, x, y) {
        super(scene, x, y, 'player');

        this.keys = scene.input.keyboard.createCursorKeys();
    }
    spawnBullet() {
        super.spawnBullet();
        this.scene.sys.registry.inc('shots')
    }
    getHurt(damage) {
        if (super.getHurt(damage)) {
            this.scene.sys.registry.values.lives -= damage;
            this.scene.cameras.main.shake(undefined, 0.05 * damage);
        }
    }
    getCoin(value) {
        this.scene.sys.registry.values.score += value;
    }
    powerUp() {
        const gates = this.scene.sys.registry.values.gates;
        this.speed = 150 + 5 * gates;
        this.touchdamage = .5 + .1 * gates;
        this.bulletdamage = 1 + .2 * gates;
        this.scene.sys.registry.values.lives += .25;
    }
    preUpdate(time, delta) {
        this.body.velocity.setTo(0, 0);
        const speed = this.speed;
        if (this.keys.left.isDown) {
            this.body.velocity.add({x:-speed, y:0});
        }
        if (this.keys.right.isDown) {
            this.body.velocity.add({x:+speed, y:0});
        }
        if (this.keys.up.isDown) {
            this.body.velocity.add({x:0, y:-speed});
        }
        if (this.keys.down.isDown) {
            this.body.velocity.add({x:0, y:+speed});
        }
        this.body.velocity.limit(speed);            
        super.preUpdate(time, delta);
        const bulletspace = 400-speed;
        if (this.scene.input.keyboard.checkDown(this.keys.space, bulletspace)) {
            this.spawnBullet();
        }
    }
}
Player.preload = function(scene) {
    const tmpl = {pixelWidth: 2, pixelHeight: 2};
    scene.textures.generate('player', {...tmpl, data:`
        ....AAA77...
        ...AABB777..
        ..AAAAAAAA..
        .AABBBA77AA.
        AABBBAB277AA
        AABBA777770A
        AABBA777770A
        AABBBAB277AA
        .AABBBA77AA.
        ..AAAAAAAA..
        ...AABB777..
        ....AAA77...
    `.split('\n').map(s => s.trim()).filter(Boolean)})
}