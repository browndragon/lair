"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tsp = _interopRequireDefault(require("@browndragon/tsp"));

var _cursors = _interopRequireDefault(require("./cursors"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import Phaser from 'phaser';
class Scene extends Phaser.Scene {
  constructor({
    key = 'Game',
    physics: {
      arcade: aParams = {},
      ...pParams
    } = {},
    ...params
  } = {}) {
    super({
      physics: {
        arcade: {
          debug: true,
          overlapBias: 8,
          tileBias: 8,
          ...aParams
        },
        ...pParams
      },
      key,
      ...params
    });
  }

  preload() {
    // Apparently the base Phaser scene doesn't have a preload to delegate to? That's weird.
    console.assert(!super.preload);

    _tsp.default.preload.runAll(this);
  }

  create() {
    // Apparently the base Phaser scene doesn't have a create to delegate to? That's weird.
    console.assert(!super.create);

    _tsp.default.create.runAll(this);

    _cursors.default.installInto(this); // /shrug.
    // this._setBoundsToCamera();

  }

  _setBoundsToCamera() {
    let main = this.cameras.main;
    main.setBackgroundColor('#FFFFFF');
    this.physics.world.setBoundsCollision(true);
    this.physics.world.setBounds(0, 0, main.width, main.height, true, true, true, true);
  }

}

exports.default = Scene;