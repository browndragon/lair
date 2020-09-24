# `@browndragon/ecs`

A generic(ish) [entity/component/system](https://en.wikipedia.org/wiki/Entity_component_system) library intended for [phaser.io](phaser.io).

This package doesn't actually implement the phaser.io bindings however; see `npm i @browndragon/phaser-ecs`.

Entities and components are merged (so entities are bags of data).

Systems are standalone; 

> Note: Currently unchanged vs updated tracking is up to you. Your test method can return falsey (but NOT undefined) to indicate unchanged. Returning undefined indicates unsubscribe.
> In the future, it's possible the test value returned will be snapshotted/diffed to determine change.

## Usage

```js
// src/greeter.test.js

import { describe, test, expect } from '@jest/globals';
import {Registry, System} from '.';  // '@browndragon/ecs'; <-- this is a unit test so I can't write that!

test('Greeter', () => {
    // For testing purposes, this is my console.
    let console = {
        c: [],
        log(x) { this.c.push(x) },
        get calls() { let c = this.c; this.c = []; return c; },
    };
    class Greeter extends System {
        test(x) {return typeof(x) == 'string'}
        update(context) {
            for (let x of context.removed) {
                console.log(`Goodbye, ${x}!`)
            }
            for (let x of context.added) {
                console.log(`Hello, ${x}!`);
            }
        }
    }
    class Replacer extends System {
        test(x) {return typeof(x) == 'string' && !x.startsWith('replaced')}
        update(context) {
            for (let x of context.added) {
                // Strings aren't mutable. If these were objects, we could modify the object then re-observe it; exercise to the reader! Instead, we'll forcibly remove it and then add it back.
                this.registry.remove(x);
                this.registry.observe(`replaced${x}`);
            }
        }
    }
    class Updated extends System {
        test(x) { return typeof(x) == 'string' }
        update(context) {
            if (context.updated.size > 0) {
                console.log(`Still here, ${[...context.updated]}?`);
            }
        }
    }
    let registry = new Registry();
    registry.add(Greeter).add(Replacer).add(Updated);

    registry.observe(7);
    registry.update();
    // Nobody is listening to boring _numbers_.
    expect(console.calls).toEqual([]);

    // Observe an apple, then do a few updates and watch each system fire.
    registry.observe('apple');
    registry.update();
    expect(console.calls).toEqual(['Hello, apple!']);
    registry.update();
    expect(console.calls).toEqual([
        'Goodbye, apple!',
        'Hello, replacedapple!'
    ]);
    registry.update();
    expect(console.calls).toEqual([]);

    // What if there are two (more) entities?
    registry.observe('banana');
    registry.observe('cherry');
    registry.update();
    expect(console.calls).toEqual(['Hello, banana!', 'Hello, cherry!']);
    registry.update();
    expect(console.calls).toEqual([
        'Goodbye, banana!', 'Goodbye, cherry!',
        'Hello, replacedbanana!', 'Hello, replacedcherry!'
    ]);
    registry.update();
    expect(console.calls).toEqual([]);

    // What about an entity we've seen before?
    registry.observe('replacedbanana')
    registry.update();
    expect(console.calls).toEqual(['Still here, replacedbanana?']);
    registry.update();
    expect(console.calls).toEqual([]);

    // What about the entity we started with, that's already been chewed up?
    registry.observe('apple');
    registry.update();
    expect(console.calls).toEqual([
        // We do greet it:
        'Hello, apple!',
        // ... then it gets transformed into `replacedapple`, which we've known about.
        // On the next update, the greeter will get a chance to process this.
        // So `Updated` gets a shot:
        'Still here, replacedapple?'
    ]);
    registry.update();
    // Is this unintuitive, that we would miss saying goodbye on the first pass?
    // In theory you could split Greeter in half to enforce ordering, implement Updater
    // in greeter (they *are* both logging, so they seem related...), or order the systems
    // replacer/greeter/updater or greeter/updater/replacer to avoid this.
    // It's down to your specific situation.
    expect(console.calls).toEqual([
        'Goodbye, apple!',
    ]);
});

```