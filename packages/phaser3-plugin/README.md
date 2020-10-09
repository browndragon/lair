# `phaser3-plugin`

Provides a [phaser.io](phaser.io) plugin basic framework.

## Usage
On the command line, `$ npm i @browndragon/phaser3-plugin` and then:
```
// index.js
import Phaser from 'phaser';  // phaser3-plugin uses a peer dependency, so this MUST be your first line before importing it!
import phaser3Plugin from '@browndragon/phaser3-plugin';

class MyObject extends phaser3Plugin.Managed {
    update(cumulative, delta) {
        /* ... */
    }
    /* ... */
}
class MyPlugin extends phaser3Plugin.Plugin {
    create({param1, param2, /* ... */}) {
        return new MyObject(param1, param2, /* ... */);
    }
    /* ... */
}

// Standard phaser preamble.
const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: 800,
  height: 600,
  plugins: {
    scene: [
      {key:'SomeKey', mapping:'someKey', plugin:MyPlugin, start:true},
    ],
  },
  scene: class extends Phaser.Scene {
    create() {
      let myObject = this.someKey.create({param1:'foo', param2:'bar', /* ... */});
      // Can do things like myObject.play(), myObject.pause(), myObject.stop()...
      /* ... */
    }
  },
});
```

The `MyObject` will have its `update` called whenever it's in state `ACTIVE` and is `add`ed or `existing`ed to an object which recursively matches these rules (`phaser3Plugin.Plugin` does so by definition).

You can use `pause` to temporarily stop calling `update` on an object and all of its children; you can use `stop` to permanently stop calling `update` on an object and all of its children.

You can also use `foo.timeScale` (and `foo.setTimeScale()` and `plugin.setGlobalTimeScale()`) to modify how time passes within these systems.

## Parts Included
### `Plugin`
A `Phaser.Plugins.ScenePlugin` base class which manages the other components. By default it also acts as a container for the other components mentioned here.

Manages the scene lifecycle for you.

### `Managed`
The base class for your plugin components.
It exposes an `update` method, as well as `play`/`stop` and `pause`/`resume` pairs.

### `Container`
A `Managed` which additionally has the creation and component methods of the `plugin` class, and so can itself contain subclasses of `Managed`... including other `Container`s.

Note that you cannot currently move `Managed` between `Container`s (or `Plugin`), so once created in a container, the instance can be destroyed, but not (safely!) change parents.
> TODO: This could be fixed. It would require some thought around how to tell the difference between "removed forever" and "removed to reparent" for observation purposes.

### A note on time
`Plugin`, `Managed`, and `Container` all expose `timeScale`, which (hierarchically) multiplies each time tick `delta` they observe. This means that if you have some chain `Plugin > Container 1 > Container 2 > ManagedFoo` and each has a timeScale of 0.5 ("half speed" compared to wall time), then the actual observed speed at `ManagedFoo` is `(0.5*0.5*0.5*0.5 =)` 1/16th normal speed.

### A note on state & observability
There are (currently) two permissible callbacks on a `Managed` (or theoretically `Container`....) instance. These are `onActive` and `onComplete`, and correspond to the `active` and `complete` object events.

Contrasting this with `animation` and `tween`, the additional events (`start`, `stop`, `update`, etc) represent an additional state machine which a subclass could provide.

## Why?!
I was looking at `animation` and `tween` and realized how similar they were -- they both have a Manager, they both have individual atoms which can be `play` and `pause` and `stop`; they support looping (... I didn't end up doing this...)...

I was writing `@browndragon/phaser3-constraint` and realized I needed something very similar: the ability to have something run on every `update`. It needed `constraints` that could be modified, paused, etc; it might even need the same hierarchy that `tween` has with `timeline`.

So I generalized it. 

While analyzing & generalizing tween, I found several bugs (well, by inspection anyway). I got worried enough that I wrote `@browndragon/sm` to implement the state machine I'd need to feel more confident that I was navigating the various states this could hold safely.