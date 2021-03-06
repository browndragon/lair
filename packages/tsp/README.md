# `@browndragon/tsp`

A [phaser 3](phaser.io) plugin which adds supports to Scene and all game objects which respect methods `postUpdate`, `tick` (which runs during each arcade physics tick) and `postTick` (runs at the same time, after all other ticks for high priority rules like walls).

It also supports registering callbacks to be invoked during the `preload` and `create` steps of the scene, intended to simplify loading & interpreting assets. This is cooperative with the scene invoking methods, in case there are specific bootstrapping or preloading scenes.

For the time-tick behaviors, you usually just need to install it but then never interact with it again, because it listens to the builtin `updateList` for *updates* (and interacting with that is your problem), but will additionally inspect every object added to the `updateList` for the above methods, which it will invoke at the appropriate times.

> Warning: If there are no physics bodies, physics doesn't run -- so your scene physics events can't run! This is particularly bad if you have a bunch of physical *forces* that *create* bodies; even a single static body would fix it so this is rare, but it could happen!

For the preload and create registration steps, you will interact with the TSP.preload and TSP.create functional objects. `TSP.preload((scene)=>{...})` and the same for `create` will register a lambda for later execution. `TSP.preload.runAll(this)` will then invoke the lambda.

## Usage

```
import Phaser from 'phaser';
import TSP from '@browndragon/tsp';

const game = new Phaser.Game({
    // ...
    plugins: {
        scene: [
            { key: '_tsp', plugin: TSP, /* mapping: 'tsp' */ },  // The mapping should be optional, since you shouldn't need to actually *do* anything with it; getting objects registered to the update list (etc) is enough.
        ],
    }
    // ...
});
// Usually, that's enough! Add objects with defined `tick(delta)`, `postTick(delta)`, and `postUpdate(time, delta)` methods to the scene updateList and this plugin will automatically invoke those methods at the appropriate times.
// Remember, you *usually* use `preUpdate` from, e.g., sprites.
```

Alternatively/also, you can reference TSP while bundling up assets for loading:
```
import Phaser from 'phaser';

import TSP from '@browndragon/tsp';
import Spritesheet from './spritesheet.png';  // Or multiple spritesheets, etc.
import Audio from './audio.mp3';  // ... and multimedia assets ofc.

export default class SomeEntity extends Phaser.GameObjects.Sprite {
    ...
    // All of these are optional.
    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        // Your own stuff.
    }
    postUpdate(time, delta) {
        // There is no super.postUpdate :-/
        // Your own stuff.
    }
    tick(delta) {
        // Your own stuff.
    }
    postTick(delta) {
        // Your own stuff.
    }
}

// NOTE: a scene which wants to *use* SomeEntity must be or be preceeded by a scene which calls
// `TSP.preload.runAll(this)` and `TSP.create.runAll(this)`.
TSP.preload(scene => {
    console.assert(scene._tsp);  // just a convenient
    scene.load.spritesheet('SomeEntity', Spritesheet);
    scene.load.audio('SomeEntity', Audio);  // This is just standard phaser loading, I don't remember how it's spelled...
});
TSP.create(scene => {
    scene.anims.create({
        key:'SomeEntity.left',
        frames: scene.anims.generateFrameNumbers('SomeEntity', {start:0, end:3}),
        frameRate: 10,
        repeat: -1,
    });
    scene.anims.create({
        key:'SomeEntity.right',
        frames: scene.anims.generateFrameNumbers('SomeEntity', {start:4, end:8}),
        frameRate: 10,
        repeat: -1,
    });
});
```