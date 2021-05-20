"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = typesToCreateObjectConfig;

// Creates an object config "old style"
function typesToCreateObjectConfig(tilemap, entities) {
  let config = [];

  for (let tileset of tilemap.tilesets) {
    for (let i = 0; i < tileset.total; ++i) {
      const gid = tileset.firstgid + i;
      let data = tileset.getTileData(gid);
      let type = data && data.type;

      if (!type) {
        continue;
      }

      let classType = dottedPath(entities, type);

      if (!classType) {
        throw new Error(`unsupported class type ${type}`);
      }

      config.push({
        gid,
        classType
      });
    }
  }
}

function dottedPath(obj, path) {
  let components = path.split('.');
  let ptr = obj;

  for (let component of components) {
    ptr = obj[component];
  }

  return ptr;
}