export {default as Corners} from './corners';
export {default as embody} from './embody';
export {default as facer} from './facer';
import scoped from './scoped';
import walker from './walker';

const Walker = walker(Phaser.Physics.Arcade.Sprite);
const Wobbler = scoped(Phaser.Physics.Arcade.Sprite);
export {
    scoped,
    walker,
    Walker,
    Wobbler
};