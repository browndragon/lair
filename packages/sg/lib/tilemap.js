"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = tilemap;

var _groups = _interopRequireDefault(require("./groups"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Similar to `induct` but for adding the indicated intersector groups' collisions & overlaps to the layers of a tilemap.
 */
function tilemap(tm, ...iss) {
  console.assert(tm instanceof Phaser.Tilemaps.Tilemap);
  const is = (0, _groups.default)(tm.scene, ...iss);
  let tiles = new Set();
  let intersectorMap = new Map();

  for (let i of is) {
    console.assert(!i.wantsTilesFromTileset); // No such method! You want "of" not "from".

    for (let ts of tm.tilesets) {
      let newTiles = i.wantsTilesOfTileset(ts);

      if (!newTiles) {
        continue;
      }

      if (Number.isFinite(newTiles)) {
        newTiles = [newTiles];
      }

      if (!Array.isArray(newTiles)) {
        if (newTiles) {
          newTiles = Array.from({
            length: ts.total
          }).map((_, i) => ts.firstgid + i);
        } else {
          throw 'logical bug';
        }
      }

      let intersectorTiles = intersectorMap.get(i);

      if (!intersectorTiles) {
        intersectorMap.set(i, intersectorTiles = new Set());
      }

      for (let t of newTiles) {
        tiles.add(t);
        intersectorTiles.add(t);
      }
    }
  } // Necessary? Maybe.


  let collisions = [...tiles];
  collisions.sort();

  if (collisions.length <= 0) {
    return;
  }

  for (let rawLayer of tm.layers) {
    const layer = rawLayer.tilemapLayer;
    let anyWanted = false;

    for (let [i, gidSet] of intersectorMap) {
      if (!i.wantsLayer(layer)) {
        continue;
      }

      anyWanted = true;
      setIntersector(i, gidSet, layer); // To force capture.
    }

    if (anyWanted) {
      layer.setCollision(collisions); // , undefined, false);
    }
  }
}

function setIntersector(intersector, gidSet, layer) {
  intersector.physicsAddIntersector(layer, (sprite, tile) => {
    if (!tile || !tile.canCollide) {
      return false;
    }

    if (!gidSet.has(tile.index)) {
      return false;
    }

    return intersector.process ? intersector.process(sprite, tile) : true;
  });
}