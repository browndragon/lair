// import Phaser from 'phaser';
import Registrar from './registrar';

/**
 * Provides scene-scoped singleton arcade physics groups. Subclasses Overlap and Collider provide special collider support.
 * For instance:
 * ```
 * import SG from '@browndragon/sg';
 * class EnemyGroup extends SG.Collider {
 *   static get colliders() { return [this]; }  // Self reference, totally normal.
 *   // With no special handler methods, this just handles rebound, but not special effects on bounce.
 * }
 * class BulletGroup extends SG.PGroup {}  // Ok to create a SG used only by reference in other SGs.
 * class PlayerGroup extends SG.Collider {
 *   static get colliders() { return [EnemyGroup, BulletGroup]; }  // It's fine that this *also* collides with EnemyGroup.
 *   // And with a handler method, can attach behavior:
 *   static collide(player, enemyOrBullet) { player.getHurt(enemyOrBullet); }
 * }
 * ```
 * These SingletonGroups can be (and should be!) used referentially in your code, via `MySGSubclass.group(scene)`.
 */
export default class PGroup extends Registrar(Phaser.Physics.Arcade.Group) {
    constructor(scene) {
        super(scene.physics.world, scene);
    }

    /** Makes it easier to return [this] for collisions to self-refer. THIS IS NONSTATIC! */
    group(scene) {
        console.assert(this.scene == scene);
        return this;
    }
};