import PGroup from './pGroup';

/**
 * An lGroup is a physics group whose *members* collide with the tiles of a phaser tilemap layer -- that is unusual; most other groups are represented by their own members, but these groups represent *targets*.
 * The `setCollisionOnTileLayer` finishes the linkage, conditioning the tile layer for collision against the proper tiles.
 *
 * The same layer will likely be identified by multiple different lGroups, which are useful for representing tileset types.
 * For instance, there might be an lGroup for units which are blocked by water, and another for those which are blocked by walls, etc.
 */
export default class LGroup extends PGroup {
    static setCollisionsOnTileLayer(layer, tileset) {
        for (let i = 0; i < tileset.total; ++i) {
            let tileIndex = tileset.firstgid + i;
            // Marks the tile as colliding, but doesn't update its interesting faces. This could lead to snags when walking along something, but the alternative lets you tunnel through wells when collisions are really overlaps.
            layer.setCollision(tileIndex /*, undefined, false*/);  // I think this is about recalculating bounding boxes etc?
            // Sets the callback to be this obj's callback, which 
            layer.setTileIndexCallback(tileIndex, this.collider, this);
        }
        const scene = layer.scene;
        const group = this.group(scene);
        scene.physics.add.collider(group, layer);
    }
    static collider(sprite, tile) {
        // YES DO define static collider (and now it returns bool! Return `true` to make it an overlap iirc)
        return true;
    }

    // DO NOT define static overlap or overlaps -- collider for tiles does double duty.
    // DO NOT define static colliders -- the layer has to be set with `setCollisionsOnTileLayer` to properly drive the callbacks.
}