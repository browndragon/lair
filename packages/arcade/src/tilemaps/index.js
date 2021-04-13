// Creates the named tilemap tile layer, blows out its tiles into standalone cells, and then destroys the layer.
export function createObjectsFromTileLayer(tilemap, layerName, getEntity) {
    const scene = tilemap.scene;
    let layer = tilemap.createLayer(layerName, tilemap.tilesets);
    layer.filterTiles(tile => {
        // Doesn't tileset support tiled properties too? Weird.
        const type = (tile.getTileData() || {}).type || (tile.properties || {}).type || tile.tileset.name;
        const Entity = getEntity(type);
        console.assert(Entity);
        // Center because: default anchors work that way. Go fig.
        const entity = new Entity(scene, tile.getCenterX(), tile.getCenterY());
        // Tunnel data from properties etc over?
        scene.add.existing(entity);
    });
    layer.destroy();
}

// Creates the named tilemap tile layer and then runs the listed entities against it to set up collisions.
export function createTileLayerFromTileLayer(tilemap, layerName, ...entities) {
    const scene = tilemap.scene;
    let layer = tilemap.createLayer(layerName, tilemap.tilesets);
    for (let entity of entities) {
        entity.layer(layer);
    }
}

// Creates the objects from the named tilemap object layer.
export function createObjectsFromLayer(tilemap, layerName, getEntity) {
    const scene = tilemap.scene;
    let objectLayer = tilemap.getObjectLayer(layerName);
    for (let object of objectLayer.objects) {
        const type = object.type || typeFromObjectGid(tilemap, object.gid);
        let {x, y, width, height} = object;
        console.assert(Number.isFinite(x += width / 2));
        console.assert(Number.isFinite(y += height / 2));
        const Entity = getEntity(type);
        console.assert(Entity);
        const entity = new Entity(scene, x, y);
        // Tunnel data from properties etc over?
        scene.add.existing(entity);
    }
}

// Creates the named tilemap image layer; the *only* information carried on those layers *is* their name, so this usually just creates an image...
export function createImageLayer(tilemap, layerName) {
    const scene = tilemap.scene;
    scene.add.image(0, 0, layerName);
}

function typeFromObjectGid(tilemap, gid) {
    for (let tileset of tilemap.tilesets) {
        if (tileset.containsTileIndex(gid)) {
            return (tileset.getData(gid) || {}).type || (tileset.getProperties(gid) || {}).type || tileset.name;
        }
    }
    throw 'unrecognized tile gid';
}