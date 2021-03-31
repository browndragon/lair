"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Watcher;

var _sg = _interopRequireDefault(require("@browndragon/sg"));

var _store = require("@browndragon/store");

var _isGroupClass = _interopRequireDefault(require("./isGroupClass"));

var _pool = _interopRequireDefault(require("./pool"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Is this the right thing to do? Seems impossible to believe given :pointup:

/**
 * A watcher is an autogroup which casts a shadow onto objects represented by its underlying Pool.
 *
 * There are *two* groups involved here: the Watcher group (whose members are arbitrary shadow-casting entities) and the Pool group, whose members are the tiles that will be frame-by-frame given information about whether their shadow contour has changed (via putTileAtUV).
 *
 * The PoolClazz is required to be a singletongroup, since it's going to be instantiated on the scene with `PoolClazz.group(this.scene)` (could be SG.Group or SG.PGroup). The Watcher itself isn't required to be an SG, though why wouldn't it be?.
 */
function Watcher(clazz, PoolClazz) {
  console.assert((0, _isGroupClass.default)(clazz));
  console.assert((0, _isGroupClass.default)(PoolClazz));
  console.assert(PoolClazz.prototype.putTileUV);
  console.assert(PoolClazz.group);
  return class _Watcher extends clazz {
    constructor(...params) {
      super(...params);
      this._shadowMap = new _store.Matrix();
      this._pool = PoolClazz.group(this.scene);
    }
    /**
     * Call this from `preUpdate` or `tick` or whereever.
     *
     * Runs through all members of this Watcher set and the underlying Pool set and uses `putTileUV` (ONLY!) to trigger
     * the conformTile to drive them into the correct state:
     * - Each tile overlapping one or more members of this Watcher set gets called with a wangId based on its covered corners. In theory this should never result in 0, since in theory you made the pool sized more finely grained than the smallest member of the watcher set, *right*?
     * - Each tile which is unshaded is instead putTileUV'd with `undefined`. This can be used to `removeTileUV` etc.
     */


    updateShadows() {
      this._shadowMap.clear(); // First, cast a shadow into the _shadowMap for each element that we need to watch.


      for (let member of this.getChildren()) {
        this.castShadow(member);
      } // And then reflect the (now synthesized) wangIds onto the tiles:


      for (let [[u, v], wangId] of this._shadowMap) {
        this._pool.putTileUV(wangId, u, v);
      } // And then go through the set of tiles and "remove" those which aren't in the shadow map.
      // We actually set them to the undefined value and assume the conformTile will remove them (perhaps with an animation?).


      for (let tile of this._pool.getAllTiles()) {
        let tileValue = this._shadowMap.get(tile.u, tile.v);

        if (!tileValue) {
          this._pool.putTileUV(undefined, tile.u, tile.v);
        }
      }
    }

    castShadow(member) {
      // Because we ensure that our shadow map resolution is at least 2x finer than our game object resolution, u/vCount should always be >2. If it isn't, then something can be both top & bottom (or left & right) under this math; that is always the 0 tile, which will probably look wrong.
      let b = member.getBounds();

      let [uMin, vMin] = this._pool.uv.uv(b.x, b.y, Math.floor);

      let [uMax, vMax] = this._pool.uv.uv(b.right, b.bottom, Math.ceil);

      for (let v = vMin; v <= vMax; ++v) {
        const rowPattern = v <= vMin ? kTop : v >= vMax ? kBottom : kMiddle;

        for (let u = uMin; u <= uMax; ++u) {
          const pattern = rowPattern & (u <= uMin ? kLeft : u >= uMax ? kRight : kMiddle); // Ensure this is (newly...) in the shadow map.

          this._shadowMap.bitwiseOr(u, v, pattern);
        }
      }
    }

  };
}

const kMiddle = 0b1111;
const kTop = 0b0110;
const kRight = 0b1100;
const kBottom = 0b1001;
const kLeft = 0b0011;