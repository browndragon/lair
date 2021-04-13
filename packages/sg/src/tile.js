// import PGroup from './pGroup';

// *
//  * A Tile is an arcade physics collider targeting a tilemap.
//  * 
//  * Unlike pGroup subclasses like collider and overlap, it's *not* fully armed automatically. The user must interact with the Tile[collider] by calling its `initLayer` method, which arranges an overlap between this group and the layer, and then delegates 
//  *
//  * While it technically supports the `colliders` and `overlaps` methods, they aren't germane to the specialized tilemap behavior; instead, layers are added to the TGroup programmatically, and their tilesets examined and, thereby, collided.
//  *
//  * You'll generally have one TGroup act on one or more Tilemap Layers. So for instance, you might have exactly one TGroup subclass which gathers up the logic for your tilemap tilesets and acts on all of its layers, or multiple tilegroups for multiple layers.
//  *
//  * So, to use: Declare your customized subclass of TGroup implementing at least `getCollider`:
//  * ```
//  * import * as Colliders from '...'; import SG from '@browndragon/sg';
//  * export default class TilemapGroup extends SG.TGroup {
//  *     constructor(...params) {
//  *         super(...params);
//  *         this.tileIndexCallbacks = Colliders;
//  *     }
//  * }
//  * ```
//  * and as usual, ensure that your appropriate objects are in this group:
//  * ```
//  * import TilemapGroup from './TilemapGroup'; import SG from '@browndragon/sg';
//  * export default class Player extends SG.Member(Phaser.GameObjects.Sprite, TilemapGroup) { ... }
//  * ```
//  * and finally, when you load your map, ensure you allow this group to init the layer:
//  * ```
//  * import TilemapGroup from './TilemapGroup';
//  * export default class MyScene extends Phaser.Scene {
//  *     preload() { this.load.tilemapJSON('somekey', 'someurl.json') }
//  *     create() {
//  *         let map = this.add.tilemap('somekey');
//  *         TilemapGroup.initLayer(map.createLayer('firstlayer'));
//  *     }
//  * }
//  * ```
//  * Okay! So: what's a collider? Some examples!
//  *
//  * ```
//  * // Since this is assumed `import * as colliders`, this would be `colliders.wall`; it doesn't have any special callbacks, so the layer/group it's in must be configured to collider (rather than overlap) -- which is the default!
//  * // This assumes the wall tiles have tiled type -- or property named type -- 'wall' to match.
//  * export const wall = {};
//  *
//  * // As with wall, this one would have data type or property type 'spikeWall' -- blocks the token and hurts it.
//  * export const spikeWall = {
//  *     // The sprite is *always* first, tile always second. You can get layer from tile (and scene from sprite or layer), as well as tile gid, tileset, data, and properties -- which together can let you get enough information to specialize the effect (like: damage).
//  *     callback(sprite, tile) { sprite.takeDamage(tile.properties.damage) }
//  * }
//  * // Okay so: You *can* cancel a collision. However, the results are very ugly; because "interesting faces" are set based on whether adjacent tiles collide or not (and NOT whether they're an equivalent run of the same collision domain...), if you *do* cancel a collision, then adjacent walls that should block motion won't.
//  * export const buggySpikeTread = { callback(sprite, tile) { spikeWall.callback(sprite, tile); return true } }
//  * // TODO: Determine if explicitly calling Separate in the wall code helps. I'm sus. [update: We'd have to redo a lot of the math, which doesn't rule this out, but... Better might be to revisit the 'isInterestingFace' etc logic to put boundaries between different collision domains or types of tiles or w/e].
//  * ```
 
// export default class Tile extends PGroup {
//     static initLayer(layer, isOverlap) {
//         this.group(layer.scene).initLayer(layer, isOverlap);
//     }
//     constructor(...params) {
//         super(...params);
//         this.tileIndexCallbacks = {};
//     }
//     initLayer(layer, isOverlap) {
//         for (let tileset of layer.tilesets) {
//             this.initTileset(tileset, layer);
//         }
//         // This *doesn't* set a *specific* collider: it just generally, you know, collides (see the tilemap-specific collision above). This kind of lets you pick your favorite bug; wall layers can come later and generally respect collision, while trickier overlap-y layers can come earlier and generally do not respect collision correctly.
//         // While you can invoke a collider yourself from the overlapper, no idea how that behaves with `interestingFaces`.
//         if (isOverlap) { this.scene.physics.add.overlap(this, layer) }
//         else { this.scene.physics.add.collider(this, layer) }
//     }
//     initTileset(tileset, layer) {
//         let isCollider = this.isTilesetCollider(tileset, layer);
//         for (let i = 0; i < tileset.total; ++i) {
//             const index = tileset.firstgid + i;
//             const typename = getTileTypename(tileset, index);
//             if (!typename) { continue }
//             const tileIndexCallback = this.tileIndexCallbacks[typename];
//             if (!tileIndexCallback) { continue }
//             layer.setCollision(index, undefined, tileIndexCallback.recalculateFaces);
//             // Sets the callback to be this LGroup's callback "as normal". It now returns bool, separating callback from overlap check for this specific tile index.
//             if (tileIndexCallback.callback) { layer.setTileIndexCallback(index, tileIndexCallback.callback, tileIndexCallback) }
//         }
//     }

//     // Return falsy for layers which neither collide nor overlap (for instance, ground tiles).
//     isTilesetCollider(tileset, layer) {
//         return true;
//     }
//     // Returns the typename for the given index from the tileset.
//     // You might override this if for instance the typename is based on the tileset as a whole.
//     getTileTypename(tileset, index) {
//         let data = tileset.getTileData(tileIndex);
//         let properties = tileset.getTileProperties(tileIndex);
//         if (properties && properties.type) { return properties.type }
//         if (data && data.type) { return data.type }
//         return undefined;
//     }
// }

// export function type(gid, tileset) {
//     let data = tileset.getTileData(gid);
//     if (data && data.type) { return data.type }
//     let properties = tileset.getTileProperties(gid);
//     if (properties && properties.type) { return properties.type }
//     return tileset.name;
// }
