import Bonded from './bonded';
// import Phaser from 'phaser';  // Peer dependency; user must import this!

class BondedImage extends Bonded(Phaser.GameObjects.Image) {}
class BondedSprite extends Bonded(Phaser.GameObjects.Sprite) {}
class BondedArcadeSprite extends Bonded(Phaser.Physics.Arcade.Sprite) {}

export default {
    Bonded,
    BondedImage,
    BondedSprite,
    BondedArcadeSprite,
    
};