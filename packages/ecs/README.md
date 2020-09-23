# `@browndragon/ecs`

A generic(ish) [entity/component/system](https://en.wikipedia.org/wiki/Entity_component_system) library intended for [phaser.io](phaser.io).

This package doesn't actually implement the phaser.io bindings however; see `npm i @browndragon/phaser-ecs`.

Entities and components are merged (so entities are bags of data).

Systems are standalone; 

> Note: Currently unchanged vs updated tracking is up to you. Your test method can return falsey (but NOT undefined) to indicate unchanged. Returning undefined indicates unsubscribe.
> In the future, it's possible the test value returned will be snapshotted/diffed to determine change.

## Usage

```
import {Registry, System} from '@browndragon/ecs';
class Greeter extends System {
    test(x) {return typeof(x) == 'string'}
    update(context, added, updated, removed, unchanged) {
        for (let x of added) {
            console.log(`Hello ${x}!`);
        }
    }
}
class Greeter extends System {
    test(x) {return typeof(x) == 'string'}
    update(context, added, updated, removed, unchanged) {
        for (let x of added) {
            console.log(`Hello ${x}!`);
        }
    }
}
let registry = new Registry();
registry.addSystem(new MySystem());
registry.observe(7);  // Nope!
registry.observe()
```
