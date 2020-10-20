"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _parent = _interopRequireDefault(require("./parent"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import Phaser from 'phaser';

/**
 * A generic "updatable" manager.
 * You must subclass this to support, at minimum, `.create` which creates new instances of your managed class.
 * If you want the behavior of containing other elements but NOT the plugin, the
 * Container class can be a manager without needing to be the plugin itself.
 */
class Plugin extends (0, _parent.default)(Phaser.Plugins.ScenePlugin) {
  constructor(scene, pluginManager) {
    super(scene, pluginManager);
    this.systems = scene.sys;
    this.systems.events.once(SceneEvents.BOOT, this.boot, this);
    this.systems.events.on(SceneEvents.START, this.start, this);
  }

  getGlobalTimeScale() {
    return this.timeScale;
  }

  setGlobalTimeScale(timeScale) {
    this.timeScale = timeScale;
    return this;
  }
  /** Plugin scene lifecycle event. Do not call; automatically invoked. */


  preUpdate() {
    this._onboardChildren();
  }
  /** Plugin scene lifecycle event. Do not call; automatically invoked. */


  update(_, delta) {
    this._updateChildren(delta);
  }
  /** Plugin scene lifecycle event. Do not call; automatically invoked. */


  boot() {
    this.systems.events.once(SceneEvents.DESTROY, this.destroy, this);
  }
  /** Plugin scene lifecycle event. Do not call; automatically invoked. */


  start() {
    var eventEmitter = this.systems.events;
    eventEmitter.on(SceneEvents.PRE_UPDATE, this.preUpdate, this);
    eventEmitter.on(SceneEvents.UPDATE, this.update, this);
    eventEmitter.once(SceneEvents.SHUTDOWN, this.shutdown, this);
    this.timeScale = 1;
  }
  /** Plugin scene lifecycle event. Do not call; automatically invoked. */


  shutdown() {
    super.shutdown();
    let eventEmitter = this.systems.events;
    eventEmitter.off(SceneEvents.PRE_UPDATE, this.preUpdate, this);
    eventEmitter.off(SceneEvents.UPDATE, this.update, this);
    eventEmitter.off(SceneEvents.SHUTDOWN, this.shutdown, this);
  }
  /** This isn't usually necessary to call, but: turns off this manager, stopping further updates & events. */


  destroy() {
    this.shutdown();
    this.scene.sys.events.off(SceneEvents.START, this.start, this);
    this.scene = null;
    this.systems = null;
  }

}

exports.default = Plugin;
const SceneEvents = Phaser.Scenes.Events;