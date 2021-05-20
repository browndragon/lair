"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createImageLayer;

// Creates the named tilemap image layer; the *only* information carried on those layers *is* their name, so this usually just creates an image...
function createImageLayer(tilemap, layerName) {
  const scene = tilemap.scene;
  return scene.add.image(0, 0, layerName);
}