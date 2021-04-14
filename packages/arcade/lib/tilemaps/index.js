"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createObjectsFromTileLayer = createObjectsFromTileLayer;
exports.createTileLayerFromTileLayer = createTileLayerFromTileLayer;
exports.createObjectsFromLayer = createObjectsFromLayer;
exports.createImageLayer = createImageLayer;
exports.typeFromTilemap = typeFromTilemap;
exports.typeFromTileset = typeFromTileset;

// Creates the named tilemap tile layer, blows out its tiles into standalone cells, and then destroys the layer.
function createObjectsFromTileLayer(tilemap, layerName, getEntity) {
  const scene = tilemap.scene;
  let layer = tilemap.createLayer(layerName, tilemap.tilesets);
  let objects = [];
  layer.filterTiles(tile => {
    // Doesn't tileset support tiled properties too? Weird.
    const type = (tile.getTileData() || {}).type || (tile.properties || {}).type || tile.tileset.name;
    const Entity = getEntity(type);
    console.assert(Entity); // Center because: default anchors work that way. Go fig.

    const entity = new Entity(scene, tile.getCenterX(), tile.getCenterY()); // Tunnel data from properties etc over?

    scene.add.existing(entity);
    objects.push(entity);
  }, undefined, undefined, undefined, undefined, undefined, {
    isNotEmpty: true
  });
  layer.destroy();
  return objects;
} // Creates the named tilemap tile layer and then runs the listed entities against it to set up collisions.


function createTileLayerFromTileLayer(tilemap, layerName, ...entities) {
  const scene = tilemap.scene;
  let layer = tilemap.createLayer(layerName, tilemap.tilesets);

  for (let entity of entities) {
    entity.layer(layer);
  }

  return layer;
} // Creates the objects from the named tilemap object layer.


function createObjectsFromLayer(tilemap, layerName, getEntity) {
  const scene = tilemap.scene;
  let objectLayer = tilemap.getObjectLayer(layerName);
  let objects = [];

  for (let object of objectLayer.objects) {
    const type = object.type || typeFromTilemap(object.gid, tilemap);
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
    const entity = new Entity(scene, x, y); // Tunnel data from properties etc over?

    scene.add.existing(entity);
    objects.push(entity);
  }

  return objects;
} // Creates the named tilemap image layer; the *only* information carried on those layers *is* their name, so this usually just creates an image...


function createImageLayer(tilemap, layerName) {
  const scene = tilemap.scene;
  return scene.add.image(0, 0, layerName);
}

function typeFromTilemap(gid, tilemap) {
  for (let tileset of tilemap.tilesets) {
    if (tileset.containsTileIndex(gid)) {
      return typeFromTileset(gid, tileset);
    }
  }

  throw 'unrecognized tile gid';
}

function typeFromTileset(gid, tileset, defaultValue = tileset.name) {
  for (let holder of [tileset.getTileProperties(gid), tileset.getTileData(gid)]) {
    if (!holder) {
      continue;
    }

    const type = holder.type;

    if (!type) {
      continue;
    }

    return type;
  }

  return defaultValue;
}