"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _phaser = _interopRequireDefault(require("phaser"));

var _sg = _interopRequireDefault(require("@browndragon/sg"));

var _conformers = _interopRequireDefault(require("./conformers"));

var _sparse = _interopRequireDefault(require("./sparse"));

var _tilemath = _interopRequireDefault(require("./tilemath"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** A Pool manages instances of its internal class similar to a tilemap(/layer); using setTileGeometry results in a grid offset, and setConformer allows specializing each `tile` value.
 * These have assumed locations! Like, if you modify x & y on these things, attempts to put/remove will use the location they had when they were first created.
 */
class Pool extends _sg.default.Group {
  constructor(...params) {
    super(...params);
    this.tiledata = new _sparse.default();
    this.setTileGeometry().setConformer(new.target.DefaultConformer);
  }

  setTileGeometry(tileWidth, tileHeight, offsetX, offsetY) {
    this.tilemath = new _tilemath.default(tileWidth, tileHeight, offsetX, offsetY);
    return this;
  }

  setConformer(conformer) {
    console.assert(conformer);
    this.tileconformer = conformer;
    return this;
  }

  peekTileUV(u, v) {
    return this.tiledata.get(u, v);
  }
  /** Tile 'undefined' deletes. */


  putTileUV(tile, u, v) {
    let entry = this.tiledata.get(u, v);

    if (!entry) {
      entry = {
        go: this.prepareTileGameObject(u, v),
        u,
        v
      };
      this.tiledata.set(u, v, entry);
    }

    let oldTile = entry.tile;
    entry.tile = tile;
    this.tileconformer(entry, oldTile);
    return this;
  }

  prepareTileGameObject(u, v) {
    const [x, y] = this.tilemath.xy(u, v); // Fetch-cached or create-new & undo any previous killandhide

    let go = this.get(x, y, this.defaultKey, this.defaultFrame);
    go.setActive(true).setVisible(true);
    return go;
  }

  removeTileUV(u, v) {
    let member = this.tiledata.pop(u, v);

    if (member && member.go) {
      this.killAndHide(member.go);
    }

    return this;
  }

  *getTilesWorld(x, y, w, h) {
    const [uMin, vMin, uCount, vCount] = this.tilemath.uvBounds(x, y, w, h);

    for (let v = 0; v < vCount; ++v) {
      for (let u = 0; u < uCount; ++u) {
        const tile = this.tiledata.get(uMin + u, vMin + v);

        if (tile) {
          yield tile;
        }
      }
    }
  }

  getAllTiles() {
    return this.tiledata.values();
  }

}

exports.default = Pool;
Pool.DefaultConformer = _conformers.default.LiteralFrame;