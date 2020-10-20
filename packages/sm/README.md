# `@browndragon/sm`

A tiny little state machine driver.

## States

A set of states is an object made of methods that take the state machine instance and potentially additional parameters, like:
```js
// src/onoff.test.js#L4-L7

export const States = {
    on(sm) {sm.transition('off')},
    off(sm) {sm.transition('on')},
};
```

You can use an es6 class based object too, of course; the only thing that's important is that you be able to return the names of your methods.

Each method is a `state`; a `state` is a function whose first parameter is a state machine instance.

> Tip: If you're concerned about minification, you can always use `Symbol`s, since then you can guarantee what-you-return is what-you-see.

## State machines

This class provides the State Machine implementation, tersely termed `SM`.

It has 3 critical methods:
* Call `reset(state, ...params)` before any other methods, from **outside** of a `state` method: This immediately transitions & steps the state machine into the given state.
* Call `transition(state, ...params)` from **inside** of a `state` method: to modify the state of this state machine so that it will enter the named state (from the current state). Multiple calls to transition will result only in the latest call being used. If the `state` method returns true, the transition will happen immediately. If the `state` method returns false, the transition will happen **on the next call to `step` with the params provided to transition ignored**. Returns true if the given state is different than the current state.
* Call `step(...params)` from **outside** of a `state` method: call the current state method with the given params (instead of any given when it transitioned)

> Tip: If you want to transition into a state and do some work immediately, but then await another external call before doing anything else, you can use a "verb/return false" pattern:
```js
// src/ramp.test.js#L4-L23

const States = {
    ramp(sm, dir) {
        console.log(`Powering ${dir}`);
        return sm.transition(dir, true);
    },
    on(sm, ramped) {
        if (ramped) {
            console.log('on');
            return false;
        }
        return sm.transition('ramp', 'off');
    },
    off(sm, ramped) {
        if (ramped) {
            console.log('off');
            return false;
        }
        return sm.transition('ramp', 'on');
    }
};
```

## Example State Machines

You can make the "OnOff" example above into a state machine and drive it using the SM object and its `reset` method to tell it where to start and its `step` method to make transitions:
```js
// src/onoff.test.js#L10-L16

let machine = new SM(States).reset('off');
expect(machine.prev).toEqual('off');

machine.step();
expect(machine.prev).toEqual('on');
machine.step();
expect(machine.prev).toEqual('off');
```
`SM`'s `before` and `after` can be overridden to handle cross-cutting behaviors:
```js
// src/onoff.test.js#L21-L29

class LoggingSM extends SM {
    before() {
        console.log(`Transition into ${this.prev} -> ${this.next}`);
    }
}
let machine = new LoggingSM(States).reset('off');
expect(console.log).toHaveBeenCalledWith('Transition into undefined -> off');
machine.step();
expect(console.log).toHaveBeenCalledWith('Transition into off -> on');
```

Alternatively, if there are choices to be made, they can live in the states, for instance:
```js
// src/water.test.js#L6-L19

export const Water = {
    solid(sm, degC) {
        if (degC > 0) { return sm.transition('liquid', degC) }
        return false;
    },
    liquid(sm, degC) {
        if (degC > 100) { return sm.transition('gas', degC) }
        if (degC < 0) { return sm.transition('solid', degC) }
        return false;
    },
    gas(sm, degC) {
        if (degC < 100) { return sm.transition('liquid', degC) }
        return false;
    },
```
As a dummy to show how to modify state transitions from the state machine (rather than the states themselves); here's an implementation of a "sublimer":
```js
class PhaseWatcher extends SM {}  // Not relevant to this example...
```
```js
// src/water.test.js#L57-L69

// Bad practice, this should just live in your states. Still, shows the principle that you might want to redirect some or all state transitions, such as for errors or similar.
class Sublimer extends PhaseWatcher {
    before() {
        let [degC, ...rest] = this.params;
        if (degC < 0 && this.prev == 'gas') {
            this.transition('solid', degC);
        }
        if (degC > 100 && this.prev == 'solid') {
            this.transition('gas', degC);
        }
        super.before([degC, ...rest]);
    }
}
```

You can absolutely use this class with (ahem) stateful states, as well as automated step progression, for instance with object literal:
```js
// src/sozu.test.js#L5-L20

const SozuState = {  // https://en.wikipedia.org/wiki/Shishi-odoshi
    fullness: 0,
    capacity: 100,
    filling(sm, amount) {
        expect(Number.isFinite(amount)).toBeTruthy();
        this.fullness += amount;
        if (this.fullness >= this.capacity) {
            return sm.transition('dumping');
        }
    },
    dumping(sm) {
        this.fullness = 0;
        return sm.transition('filling', 0);
    },
    toString() { return `${this.fullness}/${this.capacity}` }
};
```
This example causes the step which overfills the sozu to automatically transition into the `dumping` state (potentially with side effects), which resets the fullness variable and immediately transitions back into the filling state.

## Usage
`$ npm i @browndragon/sm` and then in your code,
```
import SM from '@browndragon/sm';

const sm = new SM({
    on(sm){ sm.transition('off') },
    off(sm){ sm.transition('on') },
}).reset('off');
console.log(sm.current);  // 'off'
sm.step();
console.log(sm.current);  // 'on'
sm.step();
console.log(sm.current);  // 'off'
```
