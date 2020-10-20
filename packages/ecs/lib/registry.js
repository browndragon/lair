"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _entry = _interopRequireDefault(require("./entry"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Manages systems and feeds them observations.
 * Systems are added with `register`; this is not complex and is done around construction time.
 * Some systems might want to install additional systems; they can do so with additional calls to register.
 * Entities are added, updated, and *removed with `observe` (and `remove`). When an entity is `observe`d for the first time, the additional `forceAll` parameter should be truthy (or else nobody gets a chance to subscribe). Thereafter, assume things might change about the entity but systems that care have bookmarked it; 
 * Observations that result in no-longer monitoring an entity (or calls to `remove`) 
 */
class Registry {
  constructor() {
    this.systems = new Set();
  }
  /**
   * Registers a system for calls to observe, remove, etc.
   */


  register(SystemClass, ...params) {
    let entry = new _entry.default(this);
    let system = new SystemClass(entry, ...params);
    entry.system = system;
    this.systems.add(entry);
    return this;
  }
  /**
   * Updates entity on all systems, updating subscriptions etc.
   */


  observe(entity) {
    for (let entry of this.systems.values()) {
      entry.doObserve(entity);
    }
  }
  /**
   * Updates entity to force unsubscribe on all already subscribed systems.
   * Systems may also delete on normal `touch`es, but this will remove the entity.
   * This works as long as the system has some support for deleting entities (even if there's no natural way to represent it in the entity itself, like if your entities are immutable strings). It doesn't do much if the system itself doesn't support deletion, but there will be no additional update calls with this entity without first re-adding it.
   */


  remove(entity) {
    for (let entry of this.systems.values()) {
      entry.doRemove(entity);
    }
  }

  update(...params) {
    for (let entry of this.systems.values()) {
      entry.doUpdate(...params);
    }
  }

  forEachSystem(cb) {
    for (let entry of this.values()) {
      cb(entry.system);
    }
  }

}

exports.default = Registry;