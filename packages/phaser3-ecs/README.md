# `@browndragon/phaser3-ecs`

Binds `@browndragon/ecs` to the [phaser.io]() library.

See `@browndragon/phaser3-ecs-examples` for examples (shared lerna monorepo).

## `Scene.System`
The root is the `Scene.System` which should (ideally in its constructor) `this.runSystem(SomeSystem)` for all intended systems.

Each System has the scene methods `preload()` and `create()`, as well as System-and-scene-method `update(context, time, delta)`. The System is constructed with a `this.scene` reference as well, for access to scene facilities.

While the Scene does expose `addEntity` and `removeEntity` actions, it's assumed you'll be doing most of your work within Systems; the `context.observe` and `context.remove` actions are much more convenient.