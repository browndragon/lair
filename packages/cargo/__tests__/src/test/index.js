import Cargo from '@browndragon/cargo';

// This is some very fake "test" entity which we might have in the world -- animations & spritesheets and some extra images too.
// By convention, this entity would be named "test" and would scope all of its resources under test, too!
// This creates problems for metaresources like animations or tile.json files, which need to be able to refer to assets too.
import fullgrey from './image/fullgrey.png';
import quartergrey from './image/quartergrey.png';

import dig from './spritesheet/dig.png';
import walk from './spritesheet/walk.png';

const kEntity = 'test';

export default new Cargo(kEntity, {
    image: {
        fullgrey,
        quartergrey,
    },
    spritesheet: {
        dig,
        walk,
    },
    animation: Cargo.animationRows({
        dig:4,  // The animations are all named after the file.
        walk:6,  // These are named after the file too, but see below: it's shared!
        stand:{ key:'walk', width:6, length:1 }, 
    }),
});