"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createTileLayerFromTileLayer;

// Creates the named tilemap tile layer and then runs the listed entities against it to set up collisions.
function createTileLayerFromTileLayer(tilemap, layerName, ...entities) {
  const scene = tilemap.scene;
  let layer = tilemap.createLayer(layerName, tilemap.tilesets);

  for (let entity of entities) {
    entity.layer(layer);
  }

  return layer;
}