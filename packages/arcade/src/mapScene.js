import Scene from './scene';

export default class MapScene extends Scene {
    constructor({mapJSON, ...params}) {
        super({...params});
        console.assert(mapJSON);
        this.mapJSON = mapJSON;
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
        debugger;
        let json = this.cache.tilemap.entries.entries[mapName].data
        // Upgrade json by "loading" external tilesets.
        // These are treated like any other aspect of the entity they represent:
        // they must be JSON loaded (, if needed) in the preload hook of the object, because they're NOT supported here!
        entities = {};
        for (let tileset of json.tilesets) {
            if (tileset.tilecount != undefined) {
                console.assert(tileset.name);
                continue;  // It is as upgraded as it'll get.
            }
            console.assert(tileset.source);
            const Entity = this.getTilesetEntityBySource(tileset.source, mapName);
            console.assert(Entity && Entity.tilesetJSON);
            Object.assign(tileset, Entity.tilesetJSON);
            console.assert(tileset.name);
            console.assert(!(tileset.name in entities));
            entities[tileset.name] = Entity;
        }

        // Create a tilemap (coincidentally using the above edited cached data)
        let tilemap = this.add.tilemap(mapName);
        // Load the images *into* the tilesets:
        for (let {name, type} of tilemap.tilesets) {
            let tileset = tilemap.addTilesetImage(name, this.getTilesetImageKey(name, mapName))
            // Set the entity on the tileset so we have a hook for
            tileset.Entity = entities[name];
        }
        // Load the layers. Unfortunately phaser does some annoying stuff here:
        // they separate layers by type, losing ordering info, which screws up the display list.
        // Now, that will likely screw itself up (YOU NEED Z INDEXING) but we might as well be kind.
        // Similarly, "some" (too much!) data is not copied over.
        // Luckily, we're jerks with access to the json, so:
        for (let {name, type} of json.layers) {
            switch (type) {
                case 'tilelayer':
                this.createTileLayer(tilemap, name);
                break;
                case 'objectgroup':
                this.createObjectsFromLayer(tilemap, name);
                break;
                case 'imagelayer':
                this.createImageLayer(tilemap, name);
            }
        }

        // Do we insist this be supported? Very well, let's insist.
        console.assert(this.animatedTiles);
        this.animatedTiles.init(tilemap);
        return tilemap;
    }

    // Maps from a specific tileset source path (relative to optional mapName) to the full JSON document, potentially fetched from cache.
    getTilesetJSON(sourcePath, mapName=undefined) {
        throw 'unimplemented';
    }
    getEntityForTile(gid, tileset) {
        throw 'unimplemented';
    }

    // Maps from a tileset name to the phaser image key. Assumed to be identical; override if not!
    getTilesetImageKey(name, mapName=undefined) {
        return name;
    }

    // Creates the named tilemap tile layer.
    createTileLayer(tilemap, layerName) {
        let layer = tilemap.createLayer(layerName, tilemap);
        this.setCollisionsOnTileLayer(layer);
        return layer;
    }
    setCollisionsOnTileLayer(layer) {
        // Set any collisions by index (following https://phaser.io/examples/v3/view/tilemap/collision/tile-callbacks)
        for (let tileset of layer.tileset) {
            if (!tileset.Entity.setCollisionsOnTileLayer) { continue }
            tileset.Entity.setCollisionsOnTileLayer(layer, tileset);
            // Set collision to indicate this tile can collide:
            // layer.setCollision(index, undefined, false);
            // Set the callback this tile gets when it collides:
            // layer.setTileIndexCallback(index, handler.tile, handler);
            // And finally, make the proper collisions happen:
            // scene.physics.add.collider(group, layer);
        }
    }
    // Creates the objects from the named tilemap object layer.
    createObjectsFromLayer(tilemap, layerName) {
        let objectLayer = tilemap.getObjectLayer(layerName);
        for (let object of objectLayer.objects) {
            if (object.gid != undefined) {
                for (let tileset of tilemap.tilesets) {
                    if (tileset.containsTileIndex(object.gid)) {
                        this.createObject(object, tileset.Entity, objectLayer);
                    }
                }
            }
        }
    }
    createObject(tilemapObject, Entity, objectLayer) {
        if (!Entity) { throw 'undefined' }
        let {x, y, width, height} = tilemapObject;
        [x, y, width, height].map(v => console.assert(Number.isFinite(v)));
        x += .5 * width;
        y += .5 * height;
        this.add.existing(new Entity(this, x, y));
    }
    // Creates the named tilemap image layer; the *only* information carried on those layers *is* their name, so this usually just creates an image...
    createImageLayer(tilemap, layerName) {
        this.add.image(0, 0, layerName);
    }
}