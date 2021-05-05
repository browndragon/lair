"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ticknudge;

/** Called from within physics, this directly adjusts the position of a body and sets its fields so that it can still appropriately collide. */
function ticknudge(sprite, x, y, still = .01, nudge = .001) {
  if (x == 0 && y == 0) {
    return;
  }

  sprite.body.x += x;
  sprite.body.y += y;
  sprite.body.updateCenter(); // Collision enforcement: Give it a *drop* of movement in this direction so that collision can occur if it's driven by tread.
  // There's *some* bug here about having tiles overtaken where their treadmill-driven speeds don't match.
  // This can happen because treadmill runs might be adjacent, leading to 1, 2 or 3 rounds of treadmill velocity effects on the same sized objects.
  // if (Math.abs(sprite.body.velocity.x) < still) { sprite.body.velocity.x = Math.sign(x) * nudge }
  // if (Math.abs(sprite.body.velocity.y) < still) { sprite.body.velocity.y = Math.sign(y) * nudge }
}