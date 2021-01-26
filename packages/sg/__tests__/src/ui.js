import Phaser from 'phaser';

export default class UI extends Phaser.Scene {
    constructor() {
        super({key: 'UI'});
    }
    create() {
        this.timeText = this.add.text(0, 0, `Level: ${this.sys.registry.values.gates} Time:`).setStroke('#000000', 4).setAlpha(.75);
        this.score = this.add.text(0, 16, `Score: ${this.sys.registry.values.score}`).setStroke('#000000', 4).setAlpha(.75);
        this.lives = this.add.text(0, 32, `Lives: ${this.sys.registry.values.lives}`).setStroke('#000000', 4).setAlpha(.75);
        this.sys.registry.events.on('changedata-score', (_, v) => {
            this.score.text = `Score: ${v}`;
        }, this);
        this.sys.registry.events.on('changedata-lives', (_, v) => {
            this.lives.text = `Lives: ${v}`;
        }, this);
        this.events.once('shutdown', () => {
            console.log('ui shutdown');
            // For some reason, *allowing* this nukes *all* listeners. I think it might just be broken.
            this.sys.registry.events.off('changedata-score', undefined, this);
            this.sys.registry.events.off('changedata-lives', undefined, this);
        });
    }
    update(time, delta) {
        this.timeText.text = `Level: ${this.sys.registry.values.gates} Time: ${Math.floor(this.scene.get('Game').now / 1000)}`;
    }
}