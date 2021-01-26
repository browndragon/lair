import Phaser from 'phaser';

export default class UI extends Phaser.Scene {
    constructor() {
        super({key: 'UI'});
    }
    create() {
        this.timeText = this.add.text(0, 0, `Level: ${this.sys.registry.values.gates} Time:`).setStroke('#000000', 4).setAlpha(.75);
        this.scoreText = this.add.text(0, 16, `Score: ${this.sys.registry.values.score}`).setStroke('#000000', 4).setAlpha(.75);
        this.livesText = this.add.text(0, 32, `Lives: ${this.sys.registry.values.lives}`).setStroke('#000000', 4).setAlpha(.75);
        this.sys.registry.events.on('changedata-score', this.score, this);
        this.sys.registry.events.on('changedata-lives', this.lives, this);
        this.events.once('shutdown', () => {
            console.log('ui shutdown', this);
            // For some reason, *allowing* this nukes *all* listeners. I think it might just be broken.
            this.sys.registry.events.off('changedata-score', this.score, this);
            this.sys.registry.events.off('changedata-lives', this.lives, this);
        });
    }
    update(time, delta) {
        this.timeText.text = `Level: ${this.sys.registry.values.gates} Time: ${Math.floor(this.scene.get('Game').nowOverall / 1000)}`;
    }
    score(_, v) {
        this.scoreText.text = `Score: ${v}`;
    }
    lives(_, v) {
        this.livesText.text = `Lives: ${v}`;
    }
}