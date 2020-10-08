# `@browndragon/phaser3-constraint`

You can think of a `constraint` as a sort of `tween` that instead of executing `object.v goes from v0->v1 over duration d`, continuously adjusts `object.v (,object.w,etc) to match coninuously updated values [vt, wt, etc] via strategy X`.

Some very useful examples:
* have the player's head sprite be glued to the body sprite (head -- or sword, or shadow...)
* ensure that a damage total drifts upwards and fades from the player's continuously updated position over 5 seconds.
* leash a dog sprite within 120 pixels of the walker sprite (and allow either to use mass to tug the other)
* attract the ship sprite to the black hole sprite (using velocity & acceleration)
* and many more!

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