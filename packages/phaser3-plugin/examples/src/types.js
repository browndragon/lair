import Phaser from 'phaser';
import P3Plugin from '@browndragon/phaser3-plugin';
import destructure from '@browndragon/destructure';

export class Plugin extends Rectangularize(P3Plugin.Plugin) {
  constructor(...params) {
    // Inject a dimensions which we otherwise would lack.
    super(...params, 0, 0, 800, 600);
  }
}

export class Rect extends Contained(Rectangularize(P3Plugin.Container)) {
  constructor(...params) {
    super(...params);
    this.scene = this.parent.scene;
    this.obj = this.scene.add.rectangle(
      this.x, this.y, this.w, this.h,
      Phaser.Display.Color.RandomRGB(50).color,
      .25,
    ).setOrigin(0, 0).setInteractive();
    this.obj.on('pointerup', () => {
      if (this.isPlaying()) {
        this.pause();
      } else {
        this.resume();
      }
    });
  }
}

export class Point extends Contained(Pointize(P3Plugin.Managed)) {
  constructor(...params) {
    super(...params);
    this.obj = this.parent.scene.add.text(
      this.x, this.y, this.id
    ).setOrigin(0, 0).setInteractive();
    this.obj.on('pointerup', () => {
      if (this.isPlaying()) {
        this.pause();
      } else {
        this.resume();
      }
    });
  }
}

function Pointize(clazz) {
  return class extends clazz {
    constructor(..._params) {
      const [params, x, y] = destructure(_params, 2);
      super(...params);
      this.id = '';
      this._x = x;
      this._y = y;
      this.w = 0;
      this.h = 0;
      this.dx = 0;
      this.dy = 0;
    }
    get x() { return this._x }
    get y() { return this._y }

    get left() { return this.x }
    fixLeft(left) {
      let violation = left - this.left;
      if (violation <= 0) { return }
      this.dx += violation;
    }
    get top() { return this.y }
    fixTop(top) {
      let violation = top - this.top;
      if (violation <= 0) { return }
      this.dy += violation;
    }
    get right() { return this.x + this.w }
    fixRight(right) {
      let violation = this.right - right;
      if (violation <= 0) { return }
      this.dx -= violation;
    }
    get bottom() { return this.y + this.h }
    fixBottom(bottom) {
      let violation = this.bottom - bottom;
      if (violation <= 0) { return }
      this.dy -= violation;
    }

    updateXY(delta) {
      this._x += delta * this.dx / 1000;
      this._y += delta * this.dy / 1000;
    }
  };
}

function Rectangularize(clazz) {
  return class extends Pointize(clazz) {
    constructor(..._params) {
      const [params, w, h] = destructure(_params, 2);
      super(...params);
      this.count = 0;
      this.w = w;
      this.h = h;
    }

    newId() {
      return `${this.id}.${this.count++}`;
    }
    create({type='node', x, y, w, h}) {
      switch(type) {
        case 'rect':
          return new Rect(this, x, y, w, h);
        case 'point':
          return new Point(this, x, y);
      }
    }
    rect(x, y, w, h) {
      return this.existing(new Rect(this, x, y, w, h));
    }
    point(x, y) {
      return this.existing(new Point(this, x, y));
    }
  };
}

function Contained(clazz) {
  return class extends clazz {
    constructor(...params) {
      super(...params);
      this.id = this.parent.newId();
    }

    get x() { return this.parent.x + super.x }
    get y() { return this.parent.y + super.y }

    update(timestamp, delta) {
      this.updateXY(delta);
      this.fixLeft(this.parent.left);
      this.fixRight(this.parent.right);
      this.fixTop(this.parent.top);
      this.fixBottom(this.parent.bottom);
      this.obj.setPosition(this.x, this.y);
    }
  };
}
