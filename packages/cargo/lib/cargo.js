"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _filerows = _interopRequireDefault(require("./filerows"));

var _frames = _interopRequireDefault(require("./frames"));

var _asPackfile = _interopRequireDefault(require("./asPackfile"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** A specific set of assets which are bundled together. */
class Cargo {
  constructor(name, assets) {
    this.name = name;
    this.assets = assets;
  }

  preloadScene(scene) {
    scene.load.addPack((0, _asPackfile.default)(this.name, this.assets));
  }

  assetTypes() {
    return Object.keys(this.assets);
  }

  assetsOfType(assetType) {
    // You have to interact with the phaser scene factories to actually *get* these objects ofc...
    return Object.keys(this.assets[assetType]);
  }

  asset(name) {
    return `${this.name}.${good}`;
  }
  /** Turns a module's worth of spritesheets into metadata-y animations. */


  static animationRows(cargoName, descriptors) {
    let rows = [];

    for (let i = 0; i < kOrder.length; ++i) {
      const dir = kOrder[i];

      for (let [k, v] of Object.entries(descriptors)) {
        let start = 0,
            length = 0,
            key = `${cargoName}.${k}`,
            imagekey = key;

        if (Number.isFinite(v)) {
          // it's a single number, thus whole width of row.
          length = v;
          start = i * length;
        } else {
          let width = v.width;
          start = (v.start || 0) + width * i;
          length = v.length || width - v.start;
          imagekey = v.key ? `${cargoName}.${v.key}` : key;
        }

        rows.push([`${key}.${dir}`, {
          frames: (0, _frames.default)(imagekey, start, length)
        }]);
      }
    }

    return Object.fromEntries(rows);
  }

  static frames(key, start, length) {
    return Array.from({
      length
    }).map((_, j) => ({
      key: key,
      frame: start + j
    }));
  }

}

exports.default = Cargo;
Cargo.kOrder = ['ee', 'ss', 'ww', 'nn'];