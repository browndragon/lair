// import Phaser from 'phaser'l
import Registrar from './registrar';

/**
 * Provides scene-scoped singleton Group instances with `(new (MyGroup extends Group {})).group(someScene)`.
 * Most of the time, what you actually want is a PGroup (which has physics & collider support). But this is here just in case.
 * Sometimes, what you want is an LGroup (which has tilemap layer support).
 */
export default class Group extends Registrar(Phaser.GameObjects.Group) {}