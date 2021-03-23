# `@browndragon/tsp`

A [phaser 3](phaser.io) plugin which adds supports to Scene and all game objects which respect methods `postUpdate`, `tick` (which runs during each arcade physics tick) and `postTick` (runs at the same time, after all other ticks for high priority rules like walls).

You usually just need to install it but then never interact with it again, because it listens to the builtin `updateList` for *updates* (and interacting with that is your problem), but will additionally inspect every object added to the `updateList` for the above methods, which it will invoke at the appropriate times.

Warning: If there are no physics bodies, physics doesn't run -- so your scene physics events can't run! This is particularly bad if you have a bunch of physical *forces* that *create* bodies; even a single static body would fix it so this is rare, but it could happen!

## Usage

```
import TSP from '@browndragon/tsp';

var config = {
    // ...
    plugins: {
        scene: [
            { key: '_tsp', plugin: TSP, /* mapping: 'tsp' */ },  // The mapping should be optional, since you shouldn't need to actually *do* anything with it; getting objects registered to the update list (etc) is enough.
        ],
    }
    // ...
};
// Usually, that's enough! Add objects with defined `tick(delta)`, `postTick(delta)`, and `postUpdate(time, delta)` methods to the scene updateList and this plugin will automatically invoke those methods at the appropriate times.
// Remember, you *usually* use `preUpdate` from, e.g., sprites.
```
