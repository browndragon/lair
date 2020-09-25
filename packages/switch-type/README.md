# `@browndragon/switch-type`

Install & use with `$ npm i @browndragon/switch-type` and then

```js
import switchType from '@browndragon/switch-type';
switchType(
    undefined, 
    {default(x, ...params) {console.log(`Default ${x} & params ${params}!`);}},
    'someParam1', 'someParam2'
);
// Prints 'Default undefined & params someParam1,someParam2!'
```

## Why `switchType`?
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
* `literal`: an object whose prototype is literally `Object` (as created by `Object.create` and the `{}` syntax). Also `associative`.
* `associative`: An object which `@browndragon/obj` can get/set fields on. A Map or an object literal.

Finally, objects will try to call:
* `object`: Any non-`null` js `typeof(x)=='object'`.

Finally-finally, anything will try to call:
* `default`: Anything that wasn't otherwise matched.

`switchType` returns the result of the called method or else `undefined`.

## What about other "root types"?
To make this work, I've invented several new root types which "feel like" javascript basic types. To me.
* The `values` are mostly unobjectionable.
* Everyone agrees the `undefined`/`null`/`class Object` situation is messy; this is just a semi-opinionated, semi-flexible way to cut through that. I don't consider `undefined` or `null` to be `values` in this library.
* `Object` is the root of the object hierarchy, but is also used directly as a container.
   * As a container type, it's called a `literal`.
   * As the root of the object hierarchy, it's customized into a few builtin es6 types (Map, Set, Array, RegExp). You can add more with `withHandler` (which returns a new instance with the additional handlers) or `addHandler` (which modifies the handler in-place, possibly including the globally imported one!).
