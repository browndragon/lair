// import Phaser from 'phaser';
import Registrar from './registrar';

/**
 * Provides scene-scoped singleton arcade physics groups with special collider support.
 * For instance:
 * ```
 * import SG from '@browndragon/sg';
 * class Enemy extends SG.PGroup {
 *   static get colliders() { return [this]; }  // Self reference, totally normal.
 *   // With no special handler methods, this just handles rebound, but not special effects on bounce.
 * }
 * class Bullet extends SG.PGroup {}  // Ok to create a SG used only by reference in other SGs.
 * class Player extends SG.PGroup {
 *   static get colliders() { return [Enemy, Bullet]; }
 *   // And with a handler method, can attach behavior:
 *   static collide(player, enemyOrBullet) { player.getHurt(enemyOrBullet); }
 * }
 * ```
 * These SingletonGroups can be used referentially in your code, via `MySGSubclass.group(scene)`.
 */
export default class PGroup extends Registrar(Phaser.Physics.Arcade.Group) {
    constructor(scene) {
        super(scene.physics.world, scene);
    }

    /** Creates and installs this club's group, whether or not it's been installed before. */
    static install(scene) {
        let group = super.install(scene);
        scene.sys.updateList.add(group);

        let colliders = this.colliders;
        if (colliders) {
            console.assert(Array.isArray(colliders));
            scene.physics.add.collider(
                group,
                colliders.map(g => assertSafe(g.group(scene))),
                this.collider,
                this.process,
                this,
            );
        }

        let overlaps = this.overlaps;
        if (overlaps) {
            console.assert(Array.isArray(overlaps));
            scene.physics.add.overlap(
                group,
                overlaps.map(g => assertSafe(g.group(scene))),
                this.overlap,
                this.process,
                this,
            );
        }

        return group;
    }

    // Override to return [this] to make a set self-referentially colliding.
    // If there are multiple colliders defined, which one fires in any circumstance is a little underedetermined.
    static get colliders() { return undefined }
    static collider(a, b) { }

    static get overlaps() { return undefined }
    static overlap(a, b) { }

    // Used for both collider() and overlap(), process() can cancel a collision (such as if you should break through an enemy instead of bouncing).
    // It's more efficient to *not* define it so it's not invoked, but it's there if you need it!
    // static process(a, b) { return true }
};

function assertSafe(g) {
    console.assert(
        // Relies on someone else already importing Phaser for us. We can't do it here, because npm imports mean we'd get a different definition of Phaser than the invoker would!
        (g instanceof Phaser.Physics.Arcade.Group)
        || (g instanceof Phaser.Physics.Arcade.StaticGroup)
    );
    return g;
}
