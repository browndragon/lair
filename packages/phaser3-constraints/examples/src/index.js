import Phaser from 'phaser';
import P3C from '@browndragon/phaser3-constraints';

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    plugins: {
        scene: [
            {
                key:'Constraints',
                mapping:'constraints',
                plugin:P3C.Plugin,
                start:true
            },
        ],
    },
    scene: class extends Phaser.Scene {
        constructor() {
            super({
                key: 'Scene',
                physics: { arcade: { debug: true } },
            });
        }
        create() {
            this.group = this.physics.add.group();
            const urlParams = new URLSearchParams(window.location.search);
            this[urlParams.get('test') || 'corner'](
                asNumber(urlParams.get('damp')),
                asNumber(urlParams.get('length')),
                asNumber(urlParams.get('stiffness')),
            );
            this.input.on(
                'drag',
                (pointer, gameObject, dragX, dragY) => {
                    gameObject.x = dragX
                    gameObject.y = dragY
                }
            );
            this.physics.add.collider(this.group, this.group);
        }
        _enable(object) {
            this.physics.world.enable(object);
            object.body.setBounce(1);
            object.setInteractive();
            this.input.setDraggable(object);
            return object;
        }
        corner(damp=.99, length=0, stiffness=100) {
            const center = this._enable(this.add.circle(
                400, 300, 50, Phaser.Display.Color.RandomRGB(50).color, .25
            ));
            const constraint = this.constraints.add(
                {corner:{
                    center,
                    forces:[
                        {damp},
                        {spring:{length, stiffness}},
                    ],
                }}
            );
            ['ne', 'se', 'sw', 'nw'].forEach((atCorner, i) => {
                const target = this._enable(this.add.rectangle(
                    300 + (i % 2) * 100, 200 + (i / 2) * 75,
                    100 + 10 * i, 50 + 5 * i,
                    Phaser.Display.Color.RandomRGB(50).color,
                    .25,
                ));
                this.group.add(target);
                constraint.add({target, atCorner})
            });
        }
    },
};

const game = new Phaser.Game(config);

function asNumber(string) {
    if (!string) {
        return undefined;
    }
    return +string;
}
