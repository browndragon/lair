import Phaser from 'phaser';

import Bullet from './bullet';
import Coin from './coin';
import Enemy from './enemy';
import Gate from './gate';
import Player from './player';
import Wall from './wall';

export default class Boot extends Phaser.Scene {
    constructor() {
        super({ key: 'Boot' });
    }
    preload() {
        Bullet.preload(this);
        Coin.preload(this);
        Gate.preload(this);
        Enemy.preload(this);
        Player.preload(this);
        Wall.preload(this);
    }
    create() {
        this.scene.start('Game', {});
    }
}