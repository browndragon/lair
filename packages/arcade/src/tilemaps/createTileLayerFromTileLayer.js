// Creates the named tilemap tile layer and then runs the listed entities against it to set up collisions.
export default function createTileLayerFromTileLayer(tilemap, layerName, ...entities) {
    const scene = tilemap.scene;
    let layer = tilemap.createLayer(layerName, tilemap.tilesets);
    for (let entity of entities) {
        entity.layer(layer);
    }
    return layer;
}
