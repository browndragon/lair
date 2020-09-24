# `@browndragon/collections`

A collection of es6-like datastructures I wanted to use and didn't find an equivalent quickly enough in npm.

### `EmptyIter`
A quick iteratable & iterator that contains nothing. I'm not sure if you usually return `function*(){}()` but since I wanted to cache the entry anyway...

### `MultiMap`
A `Map<K, Set<V>>` (... more or less...).

From an insertion point of view, you `add(k,v)` (instead of `set(k,v)`), and multiple adds don't result in overwriting the value of `k`. `map.get(k)` returns an iterator of values.
Iterators conceive of the entries as pairs `[k, v]` for nonunique k.

### `SortedMap` and `SortedSet`
These types assume "phased" interactions -- a flurry of modifications followed by a flurry of reads or iterations, followed by a flurry of modifications etc.
As a result, they cache an iteration order (via sorted array) calculated whenever an iteration follows a dirtying operation.

Anyway; they change the es6 guaranteed sorting order from "insertion order" to "natural sorting order". You can modify this with `FooClass.comparing((a, b)=> 0 /* or -1 or +1, as appropriate */)` -- which returns a new subclass.
### Ranges
The iteration methods (`entries`, `keys`, `values`, etc) generally accept optional parameters `begin` and `end` (so: `someMap.entries(begin, end)`). Undefined limits nothing; the first iterated element will be equal to or greater than `begin`, the last iterated element will be strictly less than `end`.

### `Table`
A 2-d Map; you can think of it a little bit as a `Map<[Krow, Kcol], V>`.

From an insertion point of view, you `set(row, col, val)`. From an iteration point of view, you iterate over `[[row, col], val]` -- and the constructor's iterator argument expects the values to be bunched in this fashion.

Additional methods are provided to use the row-based (or without loss of generality, column-based) view of the data as restricted by some of the keys.

The Table itself has a native iteration order (as Map, the order of entries created).
However, using various index restrictions, you will get the iteration order of the index type -- rows can be thought of as a map of columns->values, and columns a map of rows->values; the constructor accepts an additional 2 parameters to use other map implementations (SortedMap, for instance).

## Usage

```
import collections from '@browndragon/collections';

// TODO: DEMONSTRATE API
```
