"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = scoped;

function scoped(clazz) {
  if (clazz.animationName) {
    return clazz;
  }

  return class extends clazz {
    // The default separator for this type. This is static!
    static get separator() {
      return '.';
    }

    static animationName(prefix, infix, suffix, separator = this.separator) {
      let secondHalf = infix && suffix ? `${infix}${separator}${suffix}` : infix || suffix || '';
      return prefix && secondHalf ? `${prefix}${separator}${secondHalf}` : prefix || secondHalf || '';
    }

    animationName(infix = this.infix, suffix = this.suffix) {
      return this.constructor.animationName(this.prefix, infix, suffix);
    } // The default prefix for this type.


    get prefix() {
      return undefined;
    } // The default infix/animation for this type.


    get infix() {
      return undefined;
    }

    get suffix() {
      return undefined;
    }

    playAbsolute(animation, ...params) {
      super.play(animation, ...params);
    }

    play(animation, ...params) {
      const affixedAnimation = this.animationName(undefined, animation, undefined);
      super.play(affixedAnimation, ...params);
    }

    addedToScene() {
      super.addedToScene();
      this.play();
    }

  };
}