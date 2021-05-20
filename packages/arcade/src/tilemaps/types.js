export function typeFromTile(tile) {
    return (false
        || (tile.getTileData() || {}).type
        || (tile.properties || {}).type
        || tile.tileset.name
    );
}

export function typeFromObject(object, tilemap) {
    if (object.type) {
        return object.type;
    }
    if (Number.isFinite(object.gid)) {
        return typeFromTilemap(object.gid, tilemap);
    }
    // TODO: support at *least* text, but probably also polygons, ellipses etc.
    // See https://doc.mapeditor.org/en/stable/reference/json-map-format/#object .
    throw 'Unsupported object';
}

function typeFromTilemap(gid, tilemap) {
    console.assert(Number.isFinite(gid));
    for (let tileset of tilemap.tilesets) {
        if (tileset.containsTileIndex(gid)) {
            return typeFromTileset(gid, tileset);
        }
    }
    throw 'unrecognized tile gid';
}

// Called directly from the tile code. I guess because we do that at a higher level than usual to tear apart the animations. Hacky.
export function typeFromTileset(gid, tileset, defaultValue=tileset.name) {
    for (let holder of [tileset.getTileProperties(gid), tileset.getTileData(gid)]) {
        if (!holder) { continue }
        const type = holder.type;
        if (!type) { continue }
        return type;
    }
    return defaultValue;
}
