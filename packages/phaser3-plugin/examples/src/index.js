import Phaser from 'phaser';
import {Plugin, Rect, Point} from './types';

const config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: 800,
  height: 600,
  plugins: {
    scene: [
      {key:'RectSys', mapping:'rectsys', plugin:Plugin, start:true},
    ],
  },
  scene: class extends Phaser.Scene {
    create() {
      let tl0 = this.rectsys.add({type:'point', x:10, y:25});
      tl0.dx = 50;
      tl0.dy = 10;

      let empty = this.rectsys.add({type:'rect', x:50, y:50, w:20, h:35});
      empty.dx = -10;
      empty.dy = -7;

      let nonEmpty = this.rectsys.add({type:'rect', x:150, y:50, w:200, h:350});
      nonEmpty.dy = 20;
      for (let i = 0; i < 5; ++i) {
        let p = nonEmpty.point(10 * i, 25 * i);
        p.dx = 1;
        p.dy = i * 3;
      }

      let nested = this.rectsys.rect(350, 50, 300, 450);
      nested.dy = 5;
      for (let i = 0; i < 3; ++i) {
        let r = nested.rect(2 * i, 125 * i, 150, 100);
        r.dx = 10 * (.5 - i);
        r.dy = 7 * (.5 - i);
        for (let j = 0; j < 2; ++j) {
          let p = r.point(2 * i + 3 * j, 3 * i + 15 * j);
          p.dx = -1 + i + j;
          p.dy = 3 * (-1 + i + j);
        }
      }
      let tln = this.rectsys.add({type:'point', x:550, y:25});
      tln.dx = 25;
      tln.dy = 25;
    }
  },
};

const game = new Phaser.Game(config);
