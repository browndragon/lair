import { test, expect } from '@jest/globals';
import project from './project';

test.each([
    [undefined, undefined, undefined],
    [undefined, {}, undefined],
    [undefined, true, undefined],
    [undefined, {a:undefined}, undefined],

    [7, 7, 7],
    [7, 6, undefined],
    [7, undefined, 7],
    [7, {}, {}],
    [7, true, undefined],
    [7, {a:undefined}, {}],

    ['apple', 'apple', 'apple'],
    ['apple', 'banana', undefined],
    ['apple', undefined, 'apple'],
    ['apple', {}, {}],
    ['apple', true, undefined],
    ['apple', {a:undefined}, {}],
    ['apple', {length:undefined}, {length: 5}],

    [{}, undefined, {}],
    [{}, {}, {}],
    [{}, true, undefined],
    [{}, {a:undefined}, {}],

    [{a:1}, undefined, {a:1}],
    [{a:1}, {}, {}],
    [{a:1}, {a:undefined}, {a:1}],
    [{a:1}, {b:undefined}, {}],
    [{a:1}, {a:undefined, b:undefined}, {a:1}],

    [{a:1, b:2}, undefined, {a:1, b:2}],
    [{a:1, b:2}, {}, {}],
    [{a:1, b:2}, {a:undefined}, {a:1}],
    [{a:1, b:2}, {b:undefined}, {b:2}],
    [{a:1, b:2}, {a:undefined, b:undefined}, {a:1, b:2}],

    [{a:{b:3}}, undefined, {a:{b:3}}],
    [{a:{b:3}}, {}, {}],
    [{a:{b:3}}, {a:undefined}, {a:{b:3}}],
    [{a:{b:3}}, {b:undefined}, {}],
    [{a:{b:3}}, {a:undefined, b:undefined}, {a:{b:3}}],
    [{a:{b:3}}, {a:{b:undefined}}, {a:{b:3}}],
    [{a:{b:3}}, {a:{b:{}}}, {a:{b:{}}}],
    [{a:{b:3}}, {a:{b:3}}, {a:{b:3}}],

    [{a:{b:4, c:5}}, undefined, {a:{b:4, c:5}}],
    [{a:{b:4, c:5}}, {}, {}],
    [{a:{b:4, c:5}}, {a:undefined}, {a:{b:4, c:5}}],
    [{a:{b:4, c:5}}, {b:undefined}, {}],
    [{a:{b:4, c:5}}, {a:undefined, b:undefined}, {a:{b:4, c:5} /* no b!*/}],
    [{a:{b:4, c:5}}, {a:{b:undefined}}, {a:{b:4}}],

])('project(%p, %p)==%p', (i, t, o) => {
    expect(project(i, t)).toEqual(o);
});