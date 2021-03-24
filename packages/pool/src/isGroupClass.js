//  import Phaser from 'phaser';

/** Returns true if the prototype chain for clazz passes through Phaser Group. */
export default function isGroupClass(clazz) {
    const cp = clazz.prototype;
    if (cp == PGOGp) {
        return true;
    }
    return PGOGp.isPrototypeOf(cp);
}
const PGOGp = Phaser.GameObjects.Group.prototype;
