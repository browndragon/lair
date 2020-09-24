# `@browndragon/func`

Functional utilities.

### `Callable`
A base class which is `typeof(instance) == 'function'`, instances can be `apply` & `bind` & `call`ed, and which nonetheless is declared like a class. An intended use:
```js
// src/callableExample.test.js

import { describe, test, expect } from '@jest/globals';
import Callable from './callable';

test('CallableExample', () => {
    class IncreaseBy extends Callable {
        constructor(x) {
            super((y) => this.x + y);
            this.x = x;
        }
    }
    let increasor = new IncreaseBy(1);
    expect(increasor(2)).toBe(3);
    increasor.x = 5;
    expect(increasor(3)).toBe(8);
})
```
Note that while you can use `function` methods on this instance, `this` will still be bound to the class instance. This is similar to lambdas; I really recommend making the call to `super` a `lambda` for that reason.

### `Destructure`
es6 gives us the new destructuring syntax:
```js
let [a, b, ...rest] = [...'abcdef'];
```
But what if you wanted the righthand side, as with something like:
> :warning: This doesn't actually work!
```js
function recursivelySet(object, ...path, key, value) {
    for (let p of path) {
        if (!object) {
            return undefined;
        }
        object = object[path];
    }
    return object[key] = value;
}
```
Well, you still can't write that, but you can write:
```js
function recursivelySet(object, ...pathKeyValue) {
    let [path, key, value] = destructure(pathKeyValue, 2);
    // Same bpdy as before.
}
```
The default number of right parameters is 1, so if you're just popping one element you don't need to pass anything (`const [path, last] = destructure(pathAndLast)`). You can also destructure some left hand parameters at the same time for potential efficiency gains: `const [first, middleArray, last] = destructure(array, 1, 1)`.

### `switchType`
I got **very** fed up with the mess that is javascript type introspection, so I wrote my own.

`switchType(unknownObject, handler)` will do type analysis on the unknown object and then invoke the correctly named method on handler with the object.

The methods it will call are (roughly in order, omit irrelevants):
* `undefined` (will also try `null`)
* `null` (will also try `undefined`)
* `boolean` (a `value`)
* `bigint` (a `value`)
* `number` (a `value`)
* `string` (a `value` and an `iterable`)
* `function` (a `value`)

Then we start considering (non-null) objects; 
* `array` (an `iterable`): Anything that is `Array.isArray`.
* `map` (an `associative` and an `iterable`) -- uses `instanceof Map` (as do the other specialized types).
* `set` (an `iterable`)
* `iterable`: Anything with a `Symbol.iterator` on it (including collections & arrays & strings).
* `regExp`: An `instanceof RegExp`.
* `empty`: An object matching `{}` -- which is also a `literal`.
* `literal`: an object whose prototype is literally `Object` (as created by `Object.create` and the `{}` syntax). Also `associative`.
* `associative`: An object which `@browndragon/obj` can get/set fields on. A Map or an object literal.

Finally, objects will try to call:
* `object`: Any non-`null` js `typeof(x)=='object'`.

Finally-finally, anything will try to call:
* `default`: Anything that wasn't otherwise matched.

`switchType` returns the result of the called method or else `undefined`.

### `zip`
A little utility that given n array-like streams of data `A, B, C`, returns an iterable over the inner join with elements `[a, b, c]`.
