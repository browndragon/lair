"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = bouncy;

/** 
 * Due to a... bug? Behavior?... in phaser, the *last* pgroup you get added to controls whether the worldbounds stuff is respected.
 * This is horribly stupid but also true.
 * So: instead, override your addedToScene at the leaf to call bouncy(this).
 */
function bouncy(object) {
  object.scene.physics.world.enable(object); // Just in case it hasn't already happened.

  object.body.setCollideWorldBounds(true, 1, 1);
  object.body.onWorldBounds = true;
  object.body.setBounce(1, 1);
}