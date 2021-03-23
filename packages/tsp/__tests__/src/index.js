import Phaser from 'phaser';
import TSP from '@browndragon/tsp';


class UpdateAndTick extends Phaser.GameObjects.Text {
    constructor(scene, x, y, key, frame) {
        super(scene, x, y, new.target.mintName(key, frame));
    }
    static mintName(key, frame) {
        return [key, frame].filter(Boolean).join('');
    }
    // Exactly as sprite does!
    addedToScene() {
        super.addedToScene();
        this.scene.sys.updateList.add(this);
    }

    preUpdate(time, delta) {
        this.x -= delta;
    }
    postUpdate(time, delta) {
        if (this.x < 0) { this.x = 200 }
        if (this.x > 800) { this.x = 600 }
        if (this.y < 0) { this.y = 200 }
        if (this.y > 600) { this.y = 400 }
        this.y += 1;
    }
    tick(delta) {
        this.x += delta;
    }
}

class Base extends Phaser.Scene {
    static get myname() { throw 'undefined' }
    static get next() { throw 'undefined' }
    static get config() {
        return {
            key: this.myname,
            physics: { arcade: { } }
        };
    }
    constructor() {
        super(new.target.config);
    }
    create() {
        this.g = this.physics ? this.physics.add.group() : this.add.group();
        this.g.createMultiple({
            classType: UpdateAndTick,
            key: "!",
            frame: Array.from({length:10}).map((_, i) => i),
            frameQuantity: 1,
            repeat: 1,
            setXY: {
                x: 32,
                y: 16,
                stepX: 16,
                stepY: 16,
            },
        });
        this.input.keyboard.once(
            'keydown-SPACE', () => this.scene.start(this.constructor.next)
        );
        this.label = this.add.text(16, 16, this.constructor.myname);
        this.count = 0;
    }
    update(time, delta) {
        this.label.text = `${this.constructor.myname}: ${this.count}`;
    }
}
class A extends Base {
    static get myname() { return 'A' }
    static get next() { return 'B' }
    static get config() { return {key:'A' /* no physics */} }
    postUpdate(time, delta) {
        this.count++;
    }
}
class B extends Base {
    static get myname() { return 'B' }
    static get next() { return 'C' }
    tick(delta) {
        this.count++;
    }
}
class C extends Base {
    static get myname() { return 'C' }
    static get next() { return 'A' }
    postTick(delta) {
        this.count++;
    }
}

const game = new Phaser.Game({
    plugins: {
        scene: [
            TSP.installClause,
        ],
    },
    width: 800,
    height: 600,
    backgroundColor: '222222',
    render: {
        pixelArt: true,
    },
    scene: [
        A,
        B,
        C,
    ],
});
