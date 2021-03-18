"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/**
 * Everything's an animation; some things just have fewer frames.
 *
 * Provides methods for setting specific frames, textures, texture *and* frame, or animations based on an input `tile`.
 *
 * This doesn't guarantee that the target supports the mechanism (for instance: a Phaser.GameObject.Image actually can't play an animation), but it will at least attempt to play it as desired and then you'll know.
 */
const Conformers = {
  // Some methods suitable for lookup.

  /** Uses the tile identifier as itself. Great for Frames, where they might be 1:1. */
  literal(tile) {
    return tile;
  },

  /** Looks up the tile in the given array -- using [], so it will also technically work on objects. */
  Array(array) {
    return tile => array[tile];
  },

  /** Inhibits repeated calls to the same transition */
  once(conformer) {
    return (entry, oldTile) => entry.tile == oldTile ? entry.go : conformer(entry, oldTile);
  },

  // Others, like geometry, might be best served with a lambda function or something.
  // Now: conformer factories. Given a lookup function, returns the conformer object; these set:

  /** Sets the lookup(tile) as a frame. */
  Frame(lookup) {
    return ({
      go,
      tile
    }) => go.setFrame(lookup(tile));
  },

  /** Sets the lookup(tile) as the first parameter to setTexture. */
  Texture(lookup) {
    return ({
      go,
      tile
    }) => go.setTexture(lookup(tile));
  },

  /** Sets the lookup(tile) as ...parameters to setTexture. */
  TextureFrame(lookup) {
    return ({
      go,
      tile
    }) => go.setTexture(...lookup(tile));
  },

  /** Sets the lookup(tile), ...args as an animation via play(). */
  Animation(lookup, ...args) {
    return ({
      go,
      tile
    }) => go.play(lookup(tile), ...args);
  }

};
/** Sets the tile directly as a frame. */

Conformers.LiteralFrame = Conformers.Frame(Conformers.literal);
var _default = Conformers;
exports.default = _default;