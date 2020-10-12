import Phaser from 'phaser';
import P3C from '@browndragon/phaser3-constraint';

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
        create() {
            const corners = ['ne', 'se', 'sw', 'nw'];
            const constraint = this.constraints.create({type:'corners', force:{l:0, k:.8, damp:.9}});
            for (let i = 0; i < 4; ++i) {
                const atCorner = corners[i];
                const target = this.add.rectangle(
                    300 + (i % 2) * 100, 200 + (i / 2) * 75,
                    100 + 10 * i, 50 + 5 * i,
                    Phaser.Display.Color.RandomRGB(50).color,
                    .25,
                );
                target.setInteractive();
                this.input.setDraggable(target);
                constraint.add({target, atCorner})
            }
            this.input.on(
                'drag',
                (pointer, gameObject, dragX, dragY) => {
                    gameObject.x = dragX
                    gameObject.y = dragY
                }
            );
        }
    },
};

const game = new Phaser.Game(config);
