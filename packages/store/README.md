# `store`

Stores a mapping `...k=>v` (mapping the input key values to string values using a provided pattern).

## Usage

```
import {Sparse} from '@browndragon/store';

let sparse = new Sparse();
sparse.set('hello', 1, 2);  // sparse
sparse.get(1, 2);  // 'hello'
sparse.pop(1, 2);  // 'hello'
sparse.get(1, 2);  // undefined
sparse.rmw(v=>1+(v||0), 1, 2);  // 1
sparse.rmw(v=>1+(v||0), 1, 2);  // 2
sparse.rmw(v=>1+(v||0), 1, 2);  // 3
```


## Matrix

This also provides the class 'matrix', which has the more pleasant API of putting keys before values, and being explicitly 2 dimensional (the dimensions are referred to as 'u' and 'v').