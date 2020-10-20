# `@browndragon/callable`

Install with `$ npm i @browndragon/callable`.

## Why `Callable`?
It's a base class which is `typeof(instance) == 'function'`, instances can be `apply` & `bind` & `call`ed, and which nonetheless is declared like a class. An intended use:
```js
// src/example.test.js

import { test, expect } from '@jest/globals';
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

Your subclasses can absolutely have additional methods.
