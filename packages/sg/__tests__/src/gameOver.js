import Phaser from 'phaser';
export default class GameOver extends Phaser.Scene {
    constructor() {
        super({key: 'GameOver'});
    }
    create({time=0, overrun=false}={}) {
        let salutation = overrun ? 'Terrifying' : 'Good';
        let points = this.sys.registry.values.score;
        let gates = this.sys.registry.values.gates;
        let score = points <= 0
            ? 'none!'
            : points == 1
            ? 'One red cent'
            : points < 100
            ? `${points} cents` 
            : points < 200
            ? `A dollar and ${points % 100} cents`
            : `${Math.floor(points / 100)} dollars and ${points % 100} cents`;
        this.add.text(32, 32, `
            ${salutation} Game!
            Time: ${(time / 1000).toFixed(2)} seconds
            Depth: ${gates}
            Score: ${score}
            Enemies: ${this.sys.registry.values.alltime} spawned, ${this.sys.registry.values.killed} died
            Your shots fired: ${this.sys.registry.values.shots}

            Press any key to try again!
        `);
        this.time.delayedCall(
            500,
            () => this.input.keyboard.once('keyup', () => this.scene.start('Game', {}))
        );
    }
}