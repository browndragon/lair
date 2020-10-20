import { test, expect } from '@jest/globals';
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
        update() {
            for (let x of this.context.removed) {
                console.log(`Goodbye, ${x}!`)
            }
            for (let x of this.context.added) {
                console.log(`Hello, ${x}!`);
            }
        }
    }
    class Replacer extends System {
        test(x) {return typeof(x) == 'string' && !x.startsWith('replaced')}
        update() {
            for (let x of this.context.added) {
                // Strings aren't mutable. If these were objects, we could modify the object then re-observe it; exercise to the reader! Instead, we'll forcibly remove it and then add it back.
                this.context.remove(x);
                this.context.observe(`replaced${x}`);
            }
        }
    }
    class Updated extends System {
        test(x) { return typeof(x) == 'string' }
        update() {
            if (this.context.updated.size > 0) {
                console.log(`Still here, ${[...this.context.updated]}?`);
            }
        }
    }
    let registry = new Registry();
    registry.register(Greeter).register(Replacer).register(Updated);

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
