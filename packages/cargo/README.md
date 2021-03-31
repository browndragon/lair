# `cargo`

Helps load phaser3 assets into your game by grouping them into cargo bundles.

## Usage

```
// in TestEntity/index.js
import Cargo from '@browndragon/cargo';

import a from './a.png';
import b from './b.png';
import c from './c.png';
import d from './d.wav';

const kEntity = 'TestEntity';
export default new Cargo(kEntity, {
    image: {
        a
    },
    spritesheet: {
        b,
        c: {url:c, frameConfig: {frameHeight:8} },
    },
    animation: Cargo.animationRows({
        b: 5,   // a 20-frame animation, where 0-4 are b-ing east, 5-9 south, 10-14 west, 15-19 north.
        bfirst: {key:'b', width:5, length:2 },  // The first 2 frames of each row of the above.
        c: 2  // an 8-frame animation.
    }),
    audio: {
        d: [d],
    }
});

// in MyGame.js
import Phaser from 'phaser';
import TestEntity from './TestEntity';  // /index.js ? Mine autoimports; check webpack cfg.

const game = new Phaser.Game({...
    scenes: [class extends Phaser.Scene {
        preload() {
            TestEntity.preloadScene(this);
            // All of the other entities too...
        }
        create() {
            this.add.image(0, 0, TestEntity.asset('a'));
            this.sound.play(TestEntity.asset('d'));
            // etc.
            // Also:
            console.log(TestEntity.assetTypes());  // ['image', 'spritesheet', 'animation', 'audio']
            console.log(TestEntity.assetsOfType('spritesheet'));  // ['b', 'c']
            console.log(TestEntity.assetsOfType('animation'));  // ['b.ee', 'b.ss', 'b.ww', 'b.nn', 'bfirst.ee', ..., 'bfirst.nn', 'c.ee', ..., 'c.nn']
        }
    }],
});
```
