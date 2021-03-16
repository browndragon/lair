# `@browndragon/sm`

A tiny little state machine driver.

## States

A set of states is an object made of methods that expect to be called with `this` being a state machine, and one or more parameters:
```js
// src/onoff.test.js#L5-L8

export const States = {
    on() { return States.off },
    off() { return States.on },
};
```

You could also use something like `import * as States from './states'` for a file that had `export function on() {...}` etc.
Each method is a `state`; a `state` is a function which returns other functions.

For concenvience, the cursor (and its slightly more souped up cousin Machine) are both javascript iterables and iterators. When viewed this way, their `value` is the method they will next run, and they are `done` when `value` is falsey.

## State machines

This module provides the State Machine implementation `Machine`.

Your primary interaction with the machine is to feed it an event, which you can do with `next(...params)`, this will automatically call the current state (called `value`) in the context of the machine instance with the indicated params. This returns the next state which will be entered as a consequence of seeing this event.

Its constructor takes only a single parameter: the state to enter on the next call to `next`. You can reset the state so that the next call will enter the state of your choosing with `jump`.

State machines mediate each call to `next` with a call to `this.wrap`. If you define `myStateMachine.wrap`, then that method is responsible for actually invoking 

### Machine.value
A suitable method for the state machine takes any number of arguments (it's often convenient if it takes no arguments!) and returns another suitable method.
All state machine methods are invoked in the context of the state machine object itself.

```
function stateA() { console.log('A called!'); return stateB; }
function stateB() { console.log('B called!'); return stateA; }
console.assert((new Cursor(stateA)).next().next().value == stateA);  // A called! // B called! // passes the assert.
```

#### Machine.done
Since the machine is defined as an iterator, it's also possible to write:
```js
// src/grog.test.js#L4-L25

function init() { this.food = 0; this.hungry = 0; this.sleepy = 0; this.happy = 1; }
function decide() { return this.hungry > 0 ? tryEat : this.sleepy ? doSleep : worry }
function tryEat() { return this.food > 0 ? doEat : doHunt }
function doEat() { this.food--; this.hungry--; this.happy++; console.log('Grog eat food!') }
function doHunt() { this.food++; this.sleepy++; this.happy++; console.log('Grog spend day hunting!') }
function doSleep() { this.sleepy--; this.happy++ ; console.log('Grog enjoy nap.') }
function worry() { this.sleepy++; this.hungry++; this.happy-=2; console.log('Grog troubled.') }


function grogAdventure() {
    let m = new Cursor(init);
    m.next();
    console.log('You are a neanderthal for ten days.');
    for (let i = 1; i <= 10; ++i) {
        console.log(`Dawn of the ${nth(i)} day`);
        m.jump(decide);
        for (let _ of m) {}
        const {food, hungry, sleepy, happy} = m;
        console.log('Grog is: ', {hungry, sleepy, happy}, 'Grog has: ', {food});
    }
    function nth(n) { return n == 1 ? `1st` : n == 2 ? `2nd` : n == 3 ? `3rd` : `${n}th` }
}
```
This is not necessarily useful in the general case (since it forces the operator to frequently use `jump` to restart the state machine), but it's instructive -- that `for(let _ of m){}` line 

### `Machine.wrap`
Wrap gives you the ability to specialize & redirect handling by *replacing* the call to `this.value` with a call to `this.wrap`. It is on you to ensure the current `value` is invoked, often via:

```js
let x = new Machine(someFunction);
x.wrap = function wrap(...params) {
    // ... preprocessing
    let retval = this.value.apply(this, params);
    // ... postprocessing
    return retval;  // this will be the next `value`.    
};
```

Your machine will transition to whatever `wrap` returns.

> Note: History is maintained before `wrap` is called. This means that if your `machine.value = A` and you call `machine.next()`, `machine.prevs` *will contain* `A` by the time your `machine.wrap` is called. 

### `Machine.prevs`, `.prevCount`, `.prev`

* `prevs` is the set of all states which have previously been started (so the last entry is the currently executed state).
* `prev` is the state immediately preceding `value`
* `prevCount` is the map counting the number of times each node appears in `prevs`, so that the first time you enter a node, its value will be 1, and 2 the second time, and so forth.


## Example State Machines

The `Machine.wrap` can be used to handle cross-cutting behaviors:
```js
// src/onoff.test.js#L24-L41

test('OnOffEnterExit', () => {
    let machine = new Machine(States.off);
    let log = [];
    machine.wrap = jest.fn(function(...params) {
        log.push('before', this.prev, this.value);
        let state = this.value.apply(this, params);
        log.push('after', this.value, state);
        return state;
    });

    machine.next();
    expect(machine.wrap).toHaveBeenCalledWith();
    expect(log).toEqual([
        'before', undefined, States.off,
        'after', States.off, States.on,
    ]);
    expect(machine.value).toEqual(States.on);
});
```

A simple machine that makes choices based on system properties:
```js
// src/water.test.js#L5-L12

// Implements triple phase of water WITHOUT sublimation/deposition, so that
// water goes through liquid on its way from solid to gas.
// There's intentionally hysteresis: water at 0 is a solid if it was a solid, liquid if it was a liquid.
export const Water = {
    solid(degC) { return degC > 0 ? Water.liquid : this.value },
    liquid(degC) { return degC > 100 ? Water.gas : degC < 0 ? Water.solid : this.value },
    gas(degC) { return degC < 100 ? Water.liquid : this.value },
};
```
which you can use:
```js
// src/water.test.js#L15-L21

let machine = new Cursor(Water.liquid);
expect(machine.value).toEqual(Water.liquid);

machine.next(0);
expect(machine.value).toEqual(Water.liquid);
machine.next(-1);
expect(machine.value).toEqual(Water.solid);
```
or if you want to get fancy and support sublimation *from outside of the states* -- this is generally a bad idea, but it's being included to show off the technique -- you would:
```js
// src/water.test.js#L53-L71

// Insert a pre before every call that automatically makes the state phase based on temperature.
// Note that this skips the proper phase: if it should have sublimated, this doesn't call solid at all, but merely
// ensures the state execution of gas directly!
machine.jump(Water.liquid);

var log = [];
machine.wrap = function wrapped(degC) {
    let state = (() => {
        // Patch in support for sublimation
        if (this.value == Water.solid && degC >= 100) { return Water.gas }
        if (this.value == Water.gas && degC <= 0) { return Water.solid }
        return this.value.call(this, degC);
    })();
    // Log it.
    log.push(`${this.value.name}-[${degC}]->${state.name}`);
    return state;
};
machine.next(101);
expect(machine.value).toEqual(Water.gas);
```

Perhaps you instead need some sort of countdown latch behavior:
```js
// src/sozu.test.js#L5-L20

















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
