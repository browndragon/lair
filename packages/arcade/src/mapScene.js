import * as Tilemaps from './tilemaps';
import Scene from './scene';

export default class MapScene extends Scene {
    // In your constructor, replace this with `{[myMapKey]:'myMapJsonUrl.json'}` to load *and create* one or more maps.
    // You must also implement getTilesetJSON if you intend to have out-of-line tilesets.
    constructor({mapJSON, ...params}) {
        super({...params});
        console.assert(mapJSON);
        this.mapJSON = mapJSON;
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

    preload() {
        super.preload();
        for (let [name, json] of Object.entries(this.mapJSON)) {
            this.load.tilemapTiledJSON(name, json);
        }
    }

    create() {
        super.create();
        this.mapObj = {};
        for (let name of Object.entries(this.mapJSON)) {
            this.mapObj[name] = this.addTilemapTiled(name);
        }
    }

    addTilemapTiled(mapName) {
        let json = this.cache.tilemap.entries.entries[mapName].data;
        // Upgrade json by "loading" external tilesets.
        // These are treated like any other aspect of the entity they represent:
        // they must be JSON loaded (, if needed) in the preload hook of the object, because they're NOT supported here!
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
            }
        }
    }

    // Load the layers. Unfortunately phaser does some annoying stuff here:
    // they separate layers by type, losing ordering info, which screws up the display list.
    // Now, that will likely screw itself up (YOU NEED Z INDEXING) but we might as well be kind.
    loadLayers(tilemap, json) {
        const getEntity = this.getEntity.bind(this);
        for (let {name, type} of json.layers) {
            switch (type) {
                case 'tilelayer':
                // Could also createLayerFromTileLayer.
                Tilemaps.createObjectsFromTileLayer(tilemap, name, getEntity);
                break;
                case 'objectgroup':
                Tilemaps.createObjectsFromLayer(tilemap, name, getEntity);
                break;
                case 'imagelayer':
                Tilemaps.createImageLayer(tilemap, name, getEntity);
            }
        }
    }
}