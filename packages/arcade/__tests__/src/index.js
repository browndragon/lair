import path from 'path';
import Phaser from 'phaser';
import {bouncy, MapScene, Tilemaps} from '@browndragon/arcade';
import SG from '@browndragon/sg';

import level from './level.json';
// Note the chosen art IS NOT wall-to-wall; there's a 1/4 tilesize "ridge" along the edges.
import quartergrey from './quartergrey.png';
import quartergrey_json from './quartergrey.json';

class Entity extends SG.Member(Phaser.Physics.Arcade.Image, class extends SG.Collider {
    get intersects() { return [this] }
    intersect(a, b) {}
    tileHandler(gid, tileset) {
        switch (Tilemaps.typeFromTileset(gid, tileset)) {
            case 'grey': return this.onGrey;
            default: throw 'unrecognized';
        }
    }
    onGrey(sprite, tile) { }
}) {
    constructor(scene, x, y) {
        super(scene, x, y, 'quartergrey', 0);
    }
    addedToScene() {
        super.addedToScene();
        this.scene.physics.add.existing(this);
        bouncy(this);
    }
};

const Entities = {
    // grey: class Grey extends Phaser.GameObjects.Image { },
    player: class Player extends Entity {
        preUpdate(time, delta) {
            // super.preUpdate(time, delta);  // No such method.
            this.scene.updateCursorKeyVector(128, this.body.velocity);
        }
    },
    grey: class Grey extends Entity {
        addedToScene() {
            super.addedToScene();
            this.scene.tweens.add({
                targets: this,
                alpha: .75,
                duration: 1000,
                yoyo: true,
                repeat: -1,
            });
        }
    },
};

const game = new Phaser.Game({
    // type: Phaser.AUTO,
    // parent: 'phaser-example',
    width: 800,
    height: 600,
    backgroundColor: '222222',
    render: {
        pixelArt: true,
    },
    scene: [class extends MapScene {
        constructor() {
            super({ key: 'MyScene', mapJSON: { level } });
        }
        preload() {
            this.load.image('quartergrey', quartergrey);
            super.preload();
        }
        create() {
            // Add exactly one sprite frame so we can instantiate it. We could do more, but we needn't.
            // We MUST do this first, because otherwise it'll happen after we instantiate everyone.
            this.textures.get('quartergrey').add(0, 0, 0, 0, 32, 32);
            super.create();
        }
        // Loads external spritesheets. If there were multiple, we could choose between them here.
        getTilesetJSON(source, tilemap) {
            console.assert(path.basename(source, '.json') == 'quartergrey');
            return quartergrey_json;
        }
        // Creates the entities we encounter as game objects.
        getEntity(type) { return Entities[type] }
        createTilelayer(name, tilemap) {
            return Entity.LastGroup.layer(super.createTilelayer(name, tilemap));
        }
    }],
});
