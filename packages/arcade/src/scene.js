// import Phaser from 'phaser';
import TSP from '@browndragon/tsp';
import Cursors from './cursors';

export default class Scene extends Phaser.Scene {
    constructor({
        key='Game',
        physics: {
            arcade:aParams={},
            ...pParams
        }={},
        ...params
    }={}) {
        super({
            physics: {
                arcade: {
                    debug: true,
                    overlapBias: 8,
                    tileBias: 8,
                    ...aParams,
                },
                ...pParams,
            },
            key,
            ...params,
        });
    }
    preload() {
        // Apparently the base Phaser scene doesn't have a preload to delegate to? That's weird.
        console.assert(!super.preload);
        TSP.preload.runAll(this);
    }
    create() {
        // Apparently the base Phaser scene doesn't have a create to delegate to? That's weird.
        console.assert(!super.create);
        TSP.create.runAll(this);
        Cursors.installInto(this);
        // /shrug.
        // this._setBoundsToCamera();
    }
    _setBoundsToCamera() {
        let main = this.cameras.main;
        main.setBackgroundColor('#FFFFFF');
        this.physics.world.setBoundsCollision(true);
        this.physics.world.setBounds(
            0, 0, main.width, main.height,
            true, true, true, true
        );
    }
}
