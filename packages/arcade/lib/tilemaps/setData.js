"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setDataFromTile = setDataFromTile;
exports.setDataFromObject = setDataFromObject;

function setDataFromTile(entity, tile, layer, tilemap) {
  // Set data & properties from tile
  setDataFromLayerAndMap(entity, layer, tilemap);
  setDataFromTileset(entity, tile.index, tile.tileset);
  entity.angle = tile.rotation;
  entity.flipX = tile.flipX;
  entity.flipY = tile.flipY;
  return entity;
}

function setDataFromObject(entity, object, layer, tilemap) {
  // Set data & properties from object
  setDataFromLayerAndMap(entity, layer, tilemap);
  setDataFromTileset(entity, object.gid, tilemap); // ellipse?
  // gid: handled
  // height: Handled
  // id: ignored

  entity.name = object.name; // point?
  // polygon?
  // polyline?

  setDataFromProperties(entity, object.properties);
  entity.angle = object.rotation; // Then: see ParseObject:

  entity.flipX = object.flippedHorizontal;
  entity.flipY = object.flippedVertical; // template?
  // text?
  // type: already handled.

  entity.visible = object.visible; // width: handled
  // x: handled
  // y: handled

  return entity;
}

function setDataFromLayerAndMap(entity, layer, tilemap) {
  entity.name = layer.name;
  entity.alpha = layer.opacity; // Paralaxx & y?

  if (layer.tintcolor) {
    entity.setTint(Phaser.Display.Color.HexStringToColor(layer.tintcolor).color);
  }

  entity.visible = layer.visible;
  setDataFromProperties(entity, layer.properties);
  return entity;
}

function setDataFromTileset(entity, gid, tileset) {
  return entity;
}

function setDataFromProperties(entity, properties) {
  return entity;
}