# `uv`

Utility for mapping between XY spaces and UV spaces (just linearization...)

## Usage

```
import UV from '@browndragon/uv';

let uv = new UV();  // default 16/16/-8/-8 for phaser default tilesizes
uv.u(12);  // 2
uv.v(24);  // 3
uv.x(1);  // 8
uv.y(-1);  // -24
uv.uvBounds(12, 24, 8, 18);  // [2, 3, 1, 2]
```
