import PGroup from './pGroup';

/** Abstract base class for intersecting singleton groups. See Collider or Overlap for concrete subclasses. */
export default class Intersector extends PGroup {

    /** The actual intersection code, called from collider or overlap. */
    intersect(a, b) { }
    /**
     * The set of other pgroup classes or instances to create an intersection against.
     * This does nothing to prevent mutual collision; for an overlap this is fine (both will trigger) but for collision, it's undefined (though often the earlier instantiated of the two, *not always*).
     */
    get intersects() { return undefined }
    /** Override to return an `intersect(sprite, tile)` method which is invoked when a member of this group collides with a layer configured with `layer`. */
    tileHandler(gid, tileset) { return undefined }

    /** Applies this intersector against the layer. You must explicitly call this on your layers, but probably don't override. */
    static layer(layer) {
        return this.group(layer.scene).layer(layer);
    }

    layer(layer) {
        let handlersByGid = {};
        let collisions = [];
        for (let tileset of layer.tileset) {
            for (let i = 0; i < tileset.total; ++i) {
                const gid = tileset.firstgid + i;
                const handler = this.tileHandler(gid, tileset);
                if (!handler) { continue }
                collisions.push(gid);
                // layer.setCollision(gid);  // , true, false, true);
                handlersByGid[gid] = handler;
            }
        }
        // Ensures that all necessary additional faces collide.
        layer.setCollision(collisions);

        // Then actually *use* this information. It's possible that someone else had already arranged these tiles to collide. W/e.
        this.physicsAddIntersector(layer, (sprite, tile) => {
            const handler = handlersByGid[tile.index];
            if (!handler) { return }
            handler.call(this, sprite, tile);
        });
        return layer;
    }

    install() {
        super.install();
        let intersects = this.intersects;
        if (intersects) {
            console.assert(Array.isArray(intersects));
            this.physicsAddIntersector(intersects.map(g => assertSafe(g.group(this.scene))));
        }
        return this;
    }
    // Overridden in direct subclasses to add to scene.
    physicsAddIntersector(targets, intersect=this.intersect) { throw 'unimplemented' }
}

function assertSafe(g) {
    console.assert(
        // Relies on someone else already importing Phaser for us. We can't do it here, because npm imports mean we'd get a different definition of Phaser than the invoker would!
        (g instanceof Phaser.Physics.Arcade.Group)
        || (g instanceof Phaser.Physics.Arcade.StaticGroup)
    );
    return g;
}