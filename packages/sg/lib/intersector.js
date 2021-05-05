"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _pGroup = _interopRequireDefault(require("./pGroup"));

var _groups = _interopRequireDefault(require("./groups"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** Abstract base class for intersecting singleton groups. See Collider or Overlap for concrete subclasses. */
class Intersector extends _pGroup.default {
  /** The actual intersection code, called from collider or overlap. */
  intersect(a, b) {}
  /**
   * The set of other pgroup classes or instances to create an intersection against.
   * This does nothing to prevent mutual collision; for an overlap this is fine (both will trigger) but for collision, it's undefined (though often the earlier instantiated of the two, *not always*).
   */


  get intersects() {
    return undefined;
  } // Methods for intersecting with tilemaps. These are entered by calling
  // `SG.tilemap(tilemap, Some, Set, Of, SG, Intersectors)`
  // which will examine each of the trailing arguments for relevance across the tilesets and layers of the tilemap and set up
  // colliders against those intersector's `intersect` method and relevant tiles.

  /** Return true to enable the rest of this code. False by default says never to interact with tilemap/tileset/tilelayer objects. */


  wantsTilemap(tilemap) {
    return false;
  }
  /** Return true to intersect with the given layer; false to skip. */


  wantsLayer(layer) {
    return true;
  }
  /**
   * Return an array to intersect with those gids, `true` to intersect with all gids in the tileset; falsy for none.
   * Note that wantsLayer true means that you'll *technically* collide with additional tiles, which will be suppressed for you.
   * By default, this walks over the tileset and calls `wantsTile` on each member.
   */


  wantsTilesOfTileset(tileset) {
    let wantedTiles = [];

    for (let i = 0; i < tileset.total; ++i) {
      const gid = tileset.firstgid + i;

      if (this.wantsTile(gid, tileset)) {
        wantedTiles.push(gid);
      }
    }

    return wantedTiles;
  }
  /** Return true to want a specific tile. By default returns true for any tile with a wantsTileType (via typeFromTile). */


  wantsTile(gid, tileset) {
    return this.wantsTileType(this.typeFromTile(gid, tileset));
  }
  /** Return true to want any tile with a specific type. By default returns true for any defined type. */


  wantsTileType(type) {
    return true;
  }
  /** Convenience accessor for `type` of a specific tile, which can otherwise be buried kind of deep. */


  typeFromTile(gid, tileset, defaultType = tileset.name) {
    for (let obj of [tileset.getTileProperties(gid), tileset.getTileData(gid)]) {
      if (!obj) {
        continue;
      }

      const type = obj.type;

      if (type) {
        return type;
      }
    }

    return defaultType;
  } // Override installation flow; don't call me directly (but instead use `MyIntersector.group(scene)`).


  install() {
    super.install();
    let intersects = this.intersects;

    if (intersects) {
      console.assert(Array.isArray(intersects));
      this.physicsAddIntersector((0, _groups.default)(this.scene, ...intersects));
    }

    return this;
  } // Overridden in direct subclasses to add to scene. Process can be overridden (for tiles).


  physicsAddIntersector(targets, process = this.intersect) {
    throw 'unimplemented';
  }

}

exports.default = Intersector;