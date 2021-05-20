"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createObjectsFromTileLayer;

var _types = require("./types");

var _setData = require("./setData");

// Creates the named tilemap tile layer, blows out its tiles into standalone cells, and then destroys the layer.
function createObjectsFromTileLayer(tilemap, layerName, getEntity) {
  const scene = tilemap.scene;
  let layer = tilemap.createLayer(layerName, tilemap.tilesets);
  let objects = [];
  layer.filterTiles(tile => {
    // Doesn't tileset support tiled properties too? Weird.
    const type = (0, _types.typeFromTile)(tile);
    const Entity = getEntity(type);
    console.assert(Entity); // Center because: default anchors work that way. Go fig.

    const entity = new Entity(scene, tile.getCenterX(), tile.getCenterY());
    (0, _setData.setDataFromTile)(entity, tile, layer, tilemap);
    scene.add.existing(entity);
    objects.push(entity);
  }, undefined, undefined, undefined, undefined, undefined, {
    isNotEmpty: true
  }); // Then, since we know we're blowing this apart, discard it!

  layer.destroy();
  return objects;
}