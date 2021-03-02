# `@browndragon/destructure`

Install with `$ npm i @browndragon/destructure` and import as normal with

```
import destructure from `@browndragon/destructure`
let [prefix, last] = destructure(longerArray); 
```

## Why `Destructure`?
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
    // Same body as before.
}
```
The default number of right parameters is 1, so if you're just popping one element you don't need to pass anything (`const [path, last] = destructure(pathAndLast)`). You can also destructure some left hand parameters at the same time for potential efficiency gains: `const [first, middleArray, last] = destructure(array, 1, 1)`.
