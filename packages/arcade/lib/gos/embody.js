"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = embody;

/** 
 * Due to a... bug? Behavior?... in phaser, the *last* pgroup you get added to controls whether the worldbounds stuff is respected.
 * This is horribly stupid but also true.
 * So: instead, override your addedToScene at the leaf to call bouncy(this).
 */
function embody(object, {
  bounce = 1,
  drag = 1024,
  mass = 1,
  useDamping = false
} = {}) {
  object.scene.physics.world.enable(object); // Just in case it hasn't already happened.
  // object.body.setCollideWorldBounds(true, bounce, bounce);
  // object.body.onWorldBounds = true;

  object.body.setBounce(bounce, bounce);
  object.body.setMass(mass);
  object.body.setDamping(useDamping);
  object.body.setDrag(drag);
}