import Phaser from 'phaser';
import System, { Scene } from '@browndragon/phaser3-ecs';
import logo from './logo.png';

class Bouncer extends System {
  test(x) {
    return x && x.type == 'Image';
  }
  update(context) {
    for (let img of context.added) {
      this.scene.tweens.add({
        targets: img,
        y: 200,
        scale: 4,
        duration: 2000,
        ease: 'Power2',
        yoyo: true,
        loop: -1
      });
    }
  }
}

const config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: 800,
  height: 600,
  scene: class extends Scene {
    constructor(...params) {
      super(...params);
      this.runSystem(Bouncer);
    }
    // These methods could also go into a system, especially if we had a lot of them...
    preload() {
      this.load.image('logo', logo);
    }
    create() {
      this.addEntity(this.add.image(400, 500, 'logo').setOrigin(.5, .5));
    }
  }
};

const game = new Phaser.Game(config);