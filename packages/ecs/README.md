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
    update(context) {
        for (let x of context.added) {
            console.log(`Hello ${x}!`);
        }
    }
}
class Replacer extends System {
    test(x) {return typeof(x) == 'string' && !x.startsWith('replaced')}
    update(context) {
        for (let x of added) {
            // Strings aren't mutable. If these were objects, we could modify the object then re-observe it; much sexier.
            context.registry.remove(x);
            context.registry.observe(`replaced${x}`)
        }
    }
}
let registry = new Registry();
registry.addSystem(Greeter).addSystem(Replacer);
registry.observe(7);
registry.update();  // Nope! Nothing happens
registry.observe('apple');
registry.update();  // Expect:
// console.log('Hello, apple!')
registry.update();  // Expect:
// console.log('Hello, replacedapple!')
registry.update();  // Nothing else happens.
```
