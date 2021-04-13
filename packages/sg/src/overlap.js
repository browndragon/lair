import Intersector from './intersector';

export default class Collider extends Intersector {
    /** Convenience override for intersect. */
    overlap(a, b) { }
    /** Convenience override for intersects. */
    get overlaps() { return undefined }

    /** The actual intersection code, called from collider or overlap. */
    intersect(a, b) { return this.overlap(a, b) }
    /**
     * The set of other pgroup classes or instances to create an intersection against.
     * This does nothing to prevent mutual collision; for an overlap this is fine (both will trigger) but for collision, it's undefined (though often the earlier instantiated of the two, *not always*).
     */
    get intersects() { return this.overlaps }

    physicsAddIntersector(targets, intersect=this.intersect) {
        this.scene.physics.add.overlap(
            this,
            targets,
            intersect,
            this.process,
            this,
        );
    }
}
