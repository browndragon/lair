"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var Tilemaps = _interopRequireWildcard(require("./tilemaps"));

var _scene = _interopRequireDefault(require("./scene"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

class MapScene extends _scene.default {
  // In your constructor, replace this with `{[myMapKey]:'myMapJsonUrl.json'}` to load *and create* one or more maps.
  // You must also implement getTilesetJSON if you intend to have out-of-line tilesets.
  constructor({
    mapJSON,
    ...params
  }) {
    super({ ...params
    });
    console.assert(mapJSON);
    this.mapJSON = mapJSON;
    this.boundGetEntity = this.getEntity.bind(this); // At end of create, your maps will be available in `this.mapObj`.
  } // Returns a tileset json object for the given source path [relative to the given map name].
  // If your tilesets are stored in a flat directory AND YOU INCLUDE THEIR JSON IN YOUR EXECUTABLE, you can do some surgery on the path to remove slashes & filenames and just `return flatDirectory[path.basename(tilesetSource, 'json')]`; otherwise there's some indirection through the loader etc.


  getTilesetJSON(tilesetSource, mapName) {
    throw 'unimplemented';
  } // By default assumes the tilesets are loaded under their own same name/image key.


  getTilesetImageKey(tilesetName, mapName) {
    return undefined;
  } // Returns a class type identified by name.


  getEntity(type) {
    throw 'unimplemented';
  }

  get EntityConfig() {
    throw 'unimplemented';
  } // Helper for EntityConfig.


  getEntityConfigFromModule(module, prefix = undefined, array = []) {
    if (!module) {
      return array;
    }

    switch (typeof module) {
      case 'object':
        if (Array.isArray(module)) {
          return;
        }

        if (prefix && prefix.length > 0) {
          prefix = `${prefix}.`;
        } else {
          prefix = '';
        }

        for (let key in module) {
          this.getEntityConfigFromModule(module[key], `${prefix}${key}`, array);
        }

        return array;

      case 'function':
        array.push({
          type: prefix,
          classType: module
        });
        return;

      default:
        return array;
    }
  }

  preload() {
    super.preload();

    for (let [name, json] of Object.entries(this.mapJSON)) {
      this.load.tilemapTiledJSON(name, json);
    }
  }

  create() {
    super.create();
    this.mapObj = {};

    for (let name of Object.keys(this.mapJSON)) {
      this.mapObj[name] = this.createTilemap(name);
    }
  }

  createTilemap(mapName) {
    let json = this.cache.tilemap.entries.entries[mapName].data; // Upgrade json by "loading" external tilesets.
    // These are treated like any other aspect of the entity they represent:
    // they must be JSON loaded (, if needed) in the preload hook of the object, because they're NOT supported here!
    // This is totally acceptable if we think of them similar to how we think of our extended player class: built into the game, not a standalone asset like an art asset. Especially for a large number of repetitive similar chunks ("oh, another 32x32 wang 2-corner tileset"), this is efficient.

    this.expandTilesetJSON(json, mapName); // Create a tilemap (coincidentally using the above edited cached data).

    let tilemap = this.add.tilemap(mapName); // Load the images *into* the tilesets, and record the entities:

    for (let {
      name,
      type
    } of tilemap.tilesets) {
      tilemap.addTilesetImage(name, this.getTilesetImageKey(name, mapName));
    } // Then, load the layers:


    this.loadLayers(tilemap, json);
    return tilemap;
  } // Expands map json with external tileset information.


  expandTilesetJSON(json, mapName) {
    console.assert(json && json.tilesets && json.tilesets.length);
    let gids = [];

    for (let tileset of json.tilesets) {
      if (tileset.tilecount == undefined) {
        const tilesetJSON = this.getTilesetJSON(tileset.source, mapName);
        console.assert(tilesetJSON);
        console.assert(tilesetJSON.name);
        Object.assign(tileset, tilesetJSON); // If we leave the 'source', phaser's loader will get annoyed at us.

        tileset.wasSource = tileset.source;
        delete tileset.source;
      }
    }
  } // Load the layers. Unfortunately phaser does some annoying stuff here:
  // they separate layers by type, losing ordering info, which screws up the display list.
  // Now, that will likely screw itself up (YOU NEED Z INDEXING) but we might as well be kind.


  loadLayers(tilemap, json) {
    const EntityConfig = this.EntityConfig;

    for (let {
      name,
      type
    } of json.layers) {
      switch (type) {
        case 'tilelayer':
          this.createTilelayer(name, tilemap);
          break;

        case 'objectgroup':
          // this.createObjectgroup(name, tilemap); break;
          for (let object of tilemap.createFromObjects(name, EntityConfig, true)) {
            // There doesn't seem to be anything else we need to do with these guys.
            // Bugfix: They screw up displaySize because of an intermediate load-no-image; rectify.
            object.setScale(1, 1);
          }

          break;

        case 'imagelayer':
          this.createImagelayer(name, tilemap);
          break;

        default:
          throw 'unimplemented';
      }
    }
  }

  createTilelayer(name, tilemap) {
    // Tilemaps.createObjectsFromTileLayer(tilemap, name, getEntity);
    let layer = tilemap.getLayer(name);
    console.assert(layer);

    for (let property of layer.properties || []) {
      switch (property.name) {
        case 'object':
          if (property.value) {
            return Tilemaps.createObjectsFromTileLayer(tilemap, name, this.boundGetEntity);
          }

        // Fallthrough intentional.

        default:
          continue;
      }
    }

    return Tilemaps.createTileLayerFromTileLayer(tilemap, name);
  }

  createObjectgroup(name, tilemap) {
    return Tilemaps.createObjectsFromLayer(tilemap, name, this.boundGetEntity);
  }

  createImageLayer(name, tilemap) {
    return Tilemaps.createImageLayer(tilemap, name);
  }

}

exports.default = MapScene;