"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createObjectsFromLayer;

var _types = require("./types");

var _setData = require("./setData");

// Creates the objects from the named tilemap object layer.
function createObjectsFromLayer(tilemap, layerName, getEntity) {
  const scene = tilemap.scene;
  let objectLayer = tilemap.getObjectLayer(layerName);
  let objects = [];

  for (let object of objectLayer.objects) {
    const type = (0, _types.typeFromObject)(object, tilemap);
    let {
      x,
      y,
      width,
      height
    } = object; // WTF? And yet apparently, these are the coordinate systems in which we operate.

    console.assert(Number.isFinite(x += width / 2));
    console.assert(Number.isFinite(y -= height / 2));
    const Entity = getEntity(type);
    console.assert(Entity);
    const entity = new Entity(scene, x, y);
    (0, _setData.setDataFromObject)(entity, object, objectLayer, tilemap);
    scene.add.existing(entity);
    objects.push(entity);
  }

  return objects;
}