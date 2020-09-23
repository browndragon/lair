# `@browndragon/project`

Projects a javascript object down using a template object.

Install as is usual:
```
npm i @browndragon/project
```

## Usage

Given an object like:
```js
const object = {
    position: {
        x: 1, y: 10
    },
    size: {
        width: 5, height: 15
    },
    attributes: {
        material: 'steel',
        weight: 100,
        color: 'red',
    },
    image: 'someFile',
    onClick: 'doSomething()',
    // etc
};
```
you might want to expose certain parts of this to certain parts of your code; for instance, you might want to make sure that your physics system is (generically) informed about changes to `position` or `size`, but you don't care about `image` or `onClick`. I won't help you subscribe to objects, but at least I'll let you express the parts of the object you care about via a template like:
```js
const template = {
    position: null,
    size: null,
    attributes: { material: null, weight: null }
}
```
which encapsulates that we only care about certain fields.

Then you can use that to extract the fields you care about and:
```js
import project from '@browndragon/project'
// ...
expect(project(object, template)).toEqual({
    position: {x:1, y:10},
    size: {width:5, height:15},
    attributes: {material: 'steel', weight: 100 /* look ma, no color! */}
});
```

### More examples
See the unit tests, for instance:
```js
// src/example.test.js
````