// import Phaser from 'phaser';
import TSP from '@browndragon/tsp';

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
        TSP.preload(this);
    }
    create() {
        // Apparently the base Phaser scene doesn't have a create to delegate to? That's weird.
        console.assert(!super.create);
        TSP.create(this);
        this._createCursorKeys();
        // /shrug.
        this._setBoundsToCamera();
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
    get cursorKeys() {
        return this[A];
    }
    _createCursorKeys() {
        // When the player moves an arrow, move the earliest dough.
        const KeyCodes = Phaser.Input.Keyboard.KeyCodes;
        this[A] = this.input.keyboard.addKeys({
            up: KeyCodes.UP,
            down: KeyCodes.DOWN,
            left: KeyCodes.LEFT,
            right: KeyCodes.RIGHT,

            space: KeyCodes.SPACE,
            shift: KeyCodes.SHIFT,
            esc: KeyCodes.ESC,
            enter: KeyCodes.ENTER,
            backspace: KeyCodes.BACKSPACE,
            delete: KeyCodes.DELETE,

            // Secondary navication -- comma & period are aka < & >; similar - & + imply adjustment.
            comma: KeyCodes.COMMA,
            lt: KeyCodes.COMMA,
            period: KeyCodes.PERIOD,
            gt: KeyCodes.PERIOD,
            minus: KeyCodes.MINUS,
            plus: KeyCodes.PLUS,
        });
        this[D] = new Map()
            .set(this[A].left, Phaser.Math.Vector2.LEFT)
            .set(this[A].right, Phaser.Math.Vector2.RIGHT)
            .set(this[A].up, Phaser.Math.Vector2.UP)
            .set(this[A].down, Phaser.Math.Vector2.DOWN);
        return this[A];
    }
    updateCursorKeyVector(length=128, into, clearFirst=true) {
        // Apply arrow key walking.
        if (into == undefined) {
            into = Phaser.Math.Vector2.ZERO.clone();
        }
        if (clearFirst) {
            into.x = into.y = 0;   
        }
        for (let [key, vector] of this[D]) {
            if (key.isDown && vector) {
                into.add(vector);
            }
        }
        into.setLength(length);
        return into;
    }
}
const D = Symbol('Directions');
const A = Symbol('AllKeys');