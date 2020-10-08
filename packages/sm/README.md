# `@browndragon/sm`

A tiny little state machine driver.

A set of states is an object made of methods that take the state machine instance and potentially additional parameters, like:
```js
// src/onoff.test.js#L4-7
export const States = {
  on(sm) {sm.transition('off')},
  off(sm) {sm.transition('on')},
};
```
You can make this into a state machine and drive it using the SM object and its `reset` method to tell it where to start and its `step` method to make transitions:
```js
// src/onoff.test.js#L10-16
let machine = new SM(States).reset('off');
expect(machine.key).toEqual('off');
machine.step();
expect(machine.key).toEqual('off');
machine.step();
expect(machine.key).toEqual('on');
```
SM's `before` and `after` can be overridden to handle cross-cutting behaviors:
```js
// src/onoff.test.js#L21-29
class LoggingSM extends SM {
  after(params) {
    console.log(`Transition ${this.from} -> ${this.to}`);
  }
}
let machine = new LoggingSM(States).reset('off');
// `Transition undefined -> off`
machine.step();
// `Transition off -> on`
```

Alternatively, if there are choices to be made, they can live in the states, for instance:
```js
// src/water.test.js#L6-19
export const WaterStates = {
  solid(sm, degC) {
    if (degC > 100) { sm.transition('gas') }
    else if (degC > 0) { sm.transition('solid') }
  },
  liquid(sm, degC) {
    if (degC > 100) { sm.transition('gas') }
    if (degC < 100) { sm.transition('solid') }
  },
  gas(sm, degC) {
    if (degC < 100) { sm.transition('liquid') }
    else if (degC < 0) { sm.transition('solid') }
  },
};
```
As a dummy to show how to modify state transitions from the state machine (rather than the states themselves); here's an implementation of a "sublimer":
```js
class PhaseWatcher extends SM {}  // Not relevant to this example...
```
```js
// src/water.test.js#57-68
// Bad practice, this should just live in your states. Still, shows the principle that you might want to redirect some or all state transitions, such as for errors or similar.
    class Sublimer extends PhaseWatcher {
        before([degC, ...rest]) {
            if (degC < 0 && this.prev == 'gas') {
                this.transition('solid');
            }
            if (degC > 100 && this.prev == 'solid') {
                this.transition('gas');
            }
            super.before([degC, ...rest]);
        }
    };
```

You can absolutely use this class with (ahem) stateful states, as well as automated step progression:
```js
// src/sozu.test.js#L5-23
export const SozuState {  // https://en.wikipedia.org/wiki/Shishi-odoshi
  fullness: 0,
  capacity: 100,
  filling(sm, amount) {
    this.fullness += amount;
    if (this.fullness >= this.capacity) {
      return sm.transition('dumping');
    }
  },
  dumping(sm) {
    this.fullness = 0;
    return sm.transition('filling');
  }
}
```
This example causes the step which overfills the sozu to automatically transition into the `dumping` state (potentially with side effects), which resets the fullness variable and immediately transitions back into the filling state.

## Usage
`$ npm i @browndragon/sm` and then in your code,
```
import SM from '@browndragon/sm';

```
