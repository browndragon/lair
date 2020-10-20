# `@browndragon/obj`

Utilities for interacting with es6 objects and maps "transparently".

Provides standard utilities like get/set/delete/entries/keys/forEach which need little introduction.

### `set`, `underwrite`, `overwrite`
All 3 mutation methods are similar but slightly different. They take 4 parameters:
* The `object` to mutate (map or js object)
* The `key` to add or update
* The `value` to add or update (if `undefined`, see fourth parameter!)
* `yesIWantToWriteUndefined`: An optional truthy parameter; if false, `undefined` values are never written (the method just returns); if true, values are written even if `undefined`. This avoids spuriously empty keys.

* `set` returns the `value` parameter.
* `underwrite` only updates keys which are absent (or `undefined`), returning the value the key had had.
* `overwrite` is like set, but returns the old value of the key.

## Usage

See the unit tests; for example:
```js
// src/example.test.js

import { test, expect } from '@jest/globals';
import obj from '.';  // '@browndragon/obj'; <-- this is a unit test so I can't write that!

test('Example', () => {
    expect(obj.get({a:1}, 'a')).toEqual(1);
    expect(obj.get(new Map().set('a', 1), 'a')).toEqual(1);

    let t = {};  // could have been `new Map();`! The below examples would work identically.
    expect(obj.set(t, 'a', 1)).toEqual(1);  // Object value assignment semantics.
    expect(Array.from(obj.entries(t))).toEqual([['a', 1]]);  // Entries as Object.fromEntries or map.entries. Map iterators are themselves iterable, which is the only safe assumption about the return type.
    expect(obj.delete(t, 'a')).toEqual(1);  // Returns the removed value.
    expect(() => obj.forEach(t, () => {throw 'Expected no elements!'})).not.toThrow();  // Because it's empty now.

    t = {a:{b:1}};  // Could have been `new Map([['a', new Map([['b', 1]])]]);` !
    // Underwrite: Write if the value is NOT PRESENT. Return the value it now has.
    expect(obj.underwrite(t, 'a', 1)).toEqual({b:1});
    // (just to show the aftereffects. This isn't part of the library.)
    expect(t).toEqual({a:{b:1}});
    // Overwrite: Write no matter what. Rather than returning the value written, return
    // the value it'd previously had.
    expect(obj.overwrite(t, 'a', 1)).toEqual({b:1});
    // (just to show the aftereffects. This isn't part of the library.)
    expect(t).toEqual({a:1});
});

```
