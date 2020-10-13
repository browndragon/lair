# `@browndragon/phaser3-constraint`

Constraints apply a `force` (which is defined pairwise) to [phaser.io](phaser.io) [arcade physics bodies](https://photonstorm.github.io/phaser3-docs/Phaser.Physics.Arcade.Body.html).

Currently, the only defined force is `spring`

## Constraint Concepts
A `constraint`'s configuration is
```js

````

## Installation
A standard `$ npm i @browndragon/phaser3-arcade-bond` and then in your code:

```js
import Phaser from 'phaser';
import ArcadeBond from '@browndragon/phaser3-arcade-bond';
export const game = new Phaser.Game({
    // Normal preamble, and then:
    // Install the arcadeBond plugin.
    // This will modify phaser's physics to support bonds, as well as a few similar types.
    plugins: {
        scene: [{
            key: 'ArcadeBond',
            plugin: ArcadeBond,
            mapping: 'bonds',
        }]
    },
    scene: [ class extends Phaser.Scene {
        constructor() { super({key:'GameScene', physics:{arcade:{}}, bond:{}}) }
        create() {
            this.followed = this.add.sprite(64, 64, 'img1');
            // The constraint!
            this.tweens.constrain({
                targets: this.add.text(undefined, undefined, 'Boing!'),
                constraints: {
                    hard: true,

                }
            });

            // Just a normal tween to prove the point.
            this.tweens.add({
                targets: this.followed,
                loop: -1,
                yoyo: true,
                props: {
                    x: '+= 400',
                },
            })
        }
    }],
});
```