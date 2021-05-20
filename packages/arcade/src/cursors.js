const KeyCodes = Phaser.Input.Keyboard.KeyCodes;

export default class Cursor {
    static get(scene) { return scene[C] || this.installInto(scene) }
    static installInto(scene) { return scene[C] = new this(scene).install() }

    constructor(scene) {
        this.scene = scene;
        this.scratch = new Phaser.Math.Vector2();
    }
    install() {
        const keys = this.scene.input.keyboard.addKeys(kKeycodes);
        this.dirs = new Map()
            .set(keys.left, Phaser.Math.Vector2.LEFT)
            .set(keys.right, Phaser.Math.Vector2.RIGHT)
            .set(keys.up, Phaser.Math.Vector2.UP)
            .set(keys.down, Phaser.Math.Vector2.DOWN)
            .set(keys.a, Phaser.Math.Vector2.LEFT)
            .set(keys.d, Phaser.Math.Vector2.RIGHT)
            .set(keys.w, Phaser.Math.Vector2.UP)
            .set(keys.s, Phaser.Math.Vector2.DOWN);
        Object.assign(this, keys);
        return this;
    }
    dir() {
        this.scratch.set(0, 0);
        for (let [key, dir] of this.dirs) {
            if (key.isDown) {
                this.scratch.add(dir);
            }
        }
        this.scratch.normalize();
        return this.scratch;
    }
}
const C = Symbol('Cursors');
const kKeycodes = {
    // Primary key navigation:
    up: KeyCodes.UP,
    down: KeyCodes.DOWN,
    left: KeyCodes.LEFT,
    right: KeyCodes.RIGHT,
    // More differenter key navigation:
    w: KeyCodes.W,
    a: KeyCodes.A,
    s: KeyCodes.S,
    d: KeyCodes.D,

    // Various select/fire/do-it/cancel-it keys.
    space: KeyCodes.SPACE,
    shift: KeyCodes.SHIFT,
    esc: KeyCodes.ESC,
    enter: KeyCodes.ENTER,
    backspace: KeyCodes.BACKSPACE,
    delete: KeyCodes.DELETE,

    // Additional L/R selectors -- <> and -+ (but note some of those require shift; these don't care).
    lt: KeyCodes.COMMA,
    gt: KeyCodes.PERIOD,
    minus: KeyCodes.MINUS,
    plus: KeyCodes.PLUS,
};