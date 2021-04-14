"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Registrar;

function Registrar(clazz) {
  if (clazz.group) {
    console.warn(clazz, 'already supports registrar');
    return clazz;
  }

  return class extends clazz {
    /** Returns the group this class describes, installing it if necessary via `install()`. */
    static group(scene) {
      return this.peek(scene) || new this(scene).install();
    }
    /** Returns the group this class describes IFF it's already been created; else undefined. */


    static peek(scene) {
      return registry(scene).get(this.sgRegistryKey);
    }

    static get sgRegistryKey() {
      return this;
    }
    /** Creates and installs this club's group, whether or not it's been installed before. */


    install() {
      const scene = this.scene;
      registry(scene).set(this.constructor.sgRegistryKey, this);
      scene.add.existing(this);
      return this;
    }

    destroy(...params) {
      if (this.scene) {
        let reg = registry(this.scene);

        if (reg) {
          reg.delete(this.constructor.sgRegistryKey);
        }
      }

      super.destroy(...params);
    }

  };
}

const SingletonGroups = Symbol('SingletonGroups');
/** Internal method; fetches the map of clubs -> groups. */

function registry(scene) {
  let reg = scene[SingletonGroups];

  if (reg) {
    return reg;
  }

  scene[SingletonGroups] = reg = new Map();
  scene.events.once('shutdown', sys => scene[SingletonGroups] = undefined);
  return reg;
}