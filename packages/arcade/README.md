# `arcade`

Augments phaser3 arcade physics with support for:
1) Tile groups. Phaser3 collides layers with tiles; this integrates with autogroups for better tile support.
2) Arcade springs. These are obviously a constraint satisfaction nightmare, but they're also fun! So.
3) etc?

Strongly consider using `@browndragon/sg` for better group membership & collision maintenance.
Strongly consider using `@browndragon/tsp` for better physics-linked updates.

## Usage

```
import {Spring} from '@browndragon/arcade';

function create() {
    let objectA = this.add.sprite(...);
    let objectB = this.add.image(...);
    let anchorA = anchorB = new Phaser.Math.Vector2(.5, .5);  // center
    let s = new Spring()
        .setKDL(
            .1 /* spring strength, 0->1 restores in 1 frame */,
            .2 /* drag 0->1 degrades in 1 frame */,
            .3 /* ideal length */
        )
        .setA(objectA, anchorA)
        .setB(objectB, anchorB)
    ;
}
function update(time, delta) {
    // Ideally, you should do this on each physics tick, not on each update frame. Anyway:
    s.prepare(delta);
    // You can examine s.length etc to check if the spring is still valid.
    // This will modify the bodies of A and B to spring them.
    s.execute();
}
// Then create your phaser game as normal THAT'S RIGHT NO PLUGIN.
```
