# `@browndragon/collections2`

Dumping ground for collections-y datastructures I don't currently want to work on.

### `nMap`
As per `@browndragon/collections`' `Table`, but of arbitrary dimension and more opinionated.
This is not as powerful as table, and a little bit complex to get the theory right... so I dumped it here rather than getting it correct. Consider ignoring.

In any case, because it's generic, it would provide only one ordering of indices.
> TODO: Finish.
> TODO: Can the class definition itself be described recursively? That would be sweet.
> TODO: Is this even useful?

### `Restricting`
Given `@browndragon/collections`' `SortedMap` (, `Set`, etc), it'd be nice to support the restricted iterator methods so that you could pass `start` & `end` to a map and be **more** sure you're getting restricted data back (even if unordered).

However, since you would still need to make sure you were using RestrictedMap (not es6 Map) instances, it's kind of messy. Maybe the whole notion needs to be extracted into a generic iterator-extractor, like...

### `Span`
A genericization of the `start`/`end` parameter to describe general iteration. Seems wonky & wonkish.

See also methods on `@browndragon/obj`.

## Usage

```
import collections2 from '@browndragon/collections2';

// TODO: DEMONSTRATE API
```
