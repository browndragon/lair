import Phaser from 'phaser';

import Bullet from './bullet';
import Coin from './coin';
import Enemy from './enemy';
import Player from './player';
import Wall from './wall';

import Boot from './boot';
import Game from './game';
import UI from './ui';
import GameOver from './gameOver';

const game = new Phaser.Game({
    // type: Phaser.AUTO,
    // parent: 'phaser-example',
    width: 800,
    height: 600,
    backgroundColor: '222222',
    render: {
        pixelArt: true,
    },
    scene: [Boot, Game, UI, GameOver],
});
