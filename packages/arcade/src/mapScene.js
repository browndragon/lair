import * as Tilemaps from './tilemaps';
import Scene from './scene';

export default class MapScene extends Scene {
    // In your constructor, replace this with `{[myMapKey]:'myMapJsonUrl.json'}` to load *and create* one or more maps.
    // You must also implement getTilesetJSON if you intend to have out-of-line tilesets.
    constructor({mapJSON, ...params}) {
        super({...params});
        console.assert(mapJSON);
        this.mapJSON = mapJSON;
        this.boundGetEntity = this.getEntity.bind(this);
        // At end of create, your maps will be available in `this.mapObj`.
    }

    // Returns a tileset json object for the given source path [relative to the given map name].
    // If your tilesets are stored in a flat directory AND YOU INCLUDE THEIR JSON IN YOUR EXECUTABLE, you can do some surgery on the path to remove slashes & filenames and just `return flatDirectory[path.basename(tilesetSource, 'json')]`; otherwise there's some indirection through the loader etc.
    getTilesetJSON(tilesetSource, mapName) {
        throw 'unimplemented';
    }

    // By default assumes the tilesets are loaded under their own same name/image key.
    getTilesetImageKey(tilesetName, mapName) {
        return undefined;
    }

    // Returns a class type identified by name.
    getEntity(type) {
        throw 'unimplemented';
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
        let json = this.cache.tilemap.entries.entries[mapName].data;
        // Upgrade json by "loading" external tilesets.
        // These are treated like any other aspect of the entity they represent:
        // they must be JSON loaded (, if needed) in the preload hook of the object, because they're NOT supported here!
        // This is totally acceptable if we think of them similar to how we think of our extended player class: built into the game, not a standalone asset like an art asset. Especially for a large number of repetitive similar chunks ("oh, another 32x32 wang 2-corner tileset"), this is efficient.
        this.expandTilesetJSON(json, mapName);

        // Create a tilemap (coincidentally using the above edited cached data).
        let tilemap = this.add.tilemap(mapName);
        // Load the images *into* the tilesets, and record the entities:
        for (let {name, type} of tilemap.tilesets) {
            tilemap.addTilesetImage(name, this.getTilesetImageKey(name, mapName))
        }

        this.loadLayers(tilemap, json);

        return tilemap;
    }

    // Expands map json with external tileset information.
    expandTilesetJSON(json, mapName) {
        console.assert(json && json.tilesets && json.tilesets.length);
        for (let tileset of json.tilesets) {
            if (tileset.tilecount == undefined) {
                const tilesetJSON = this.getTilesetJSON(tileset.source, mapName);
                Object.assign(tileset, tilesetJSON);
                // If we leave the 'source', phaser's loader will get annoyed at us.
                tileset.wasSource = tileset.source;
                delete tileset.source;
            }
        }
    }

    // Load the layers. Unfortunately phaser does some annoying stuff here:
    // they separate layers by type, losing ordering info, which screws up the display list.
    // Now, that will likely screw itself up (YOU NEED Z INDEXING) but we might as well be kind.
    loadLayers(tilemap, json) {
        for (let {name, type} of json.layers) {
            switch (type) {
                case 'tilelayer': this.createTilelayer(name, tilemap); break;
                case 'objectgroup': this.createObjectgroup(name, tilemap); break;
                case 'imagelayer': this.createImagelayer(name, tilemap); break;
                default: throw 'unimplemented';
            }
        }
    }
    createTilelayer(name, tilemap) {
        // Tilemaps.createObjectsFromTileLayer(tilemap, name, getEntity);
        let layer = tilemap.getLayer(name);
        console.assert(layer);
        for (let property of (layer.properties || [])) {
            switch (property.name) {
                case 'object':
                    if (property.value) {
                        return Tilemaps.createObjectsFromTileLayer(tilemap, name, this.boundGetEntity);
                    }
                    // Fallthrough intentional.
                default: continue;
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