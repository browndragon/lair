import Phaser from 'phaser';

import Enemy from './enemy';
import Gate from './gate';
import Player from './player';
import Wall from './wall';

export default class Game extends Phaser.Scene {
    constructor() {
        super({
            key: 'Game',
            physics: { arcade: { } },
        });
    }
    get nowOverall() {
        return this.now + this.sys.registry.values.playtime;
    }
    reinitializeData() {
        const gates=0, score=0, lives=1.75, shots=0, alive=0, killed=0, alltime=0, playtime=0;
        this.sys.registry.set('gates', gates);
        this.sys.registry.set('score', score);

        this.sys.registry.set('lives', lives);

        // Bullet stuff.
        this.sys.registry.set('shots', shots);

        // Really, this is about enemy stuff; we should put it in the one-time group initialization.
        this.sys.registry.set('alive', alive);
        this.sys.registry.set('killed', killed);
        this.sys.registry.set('alltime', alltime);
        this.sys.registry.set('playtime', playtime);
    }

    create({fromGate=false}={}) {
        this.scene.launch('UI');
        this.now = 0;
        if (!fromGate) {
            this.reinitializeData();
        }

        this.map = Wall.generate(this);
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.physics.world.setBoundsCollision();
        this.cameras.main.setScroll(
            (this.map.widthInPixels-this.cameras.main.width)/2,
            (this.map.heightInPixels-this.cameras.main.height)/2
        );

        let player = new Player(this, 256, 256);
        this.add.existing(player);
        this.add.existing(new Gate(
            this,
            Phaser.Math.Between(16, this.map.widthInPixels - 16),
            Phaser.Math.Between(16, this.map.heightInPixels - 16))
        );
        player.powerUp();

        console.log('game subscribe', this);
        this.sys.registry.events.on('changedata-lives', this.lives, this);
        this.sys.registry.events.on('changedata-killed', this.killed, this);

        this.timeEvent = this.time.addEvent({
            startAt: 1250,
            delay: 1500,
            loop: true,
            callback: () => this.spawn(),            
        });

        this.events.once('shutdown', () => {
            console.log('game shutdown');
            this.scene.stop('UI');
            this.sys.registry.events.off('changedata-lives', this.lives, this);
            this.sys.registry.events.off('changedata-killed', this.killed, this);
            this.sys.registry.inc('playtime', this.now);
            this.time.removeEvent(this.timeEvent);
        });
    }
    lives(_, v) {
        if (v <= 0) {
            this.scene.stop();
            this.scene.start('GameOver', {});
        }
    }
    killed(_, v) {
        this.spawn();        
    }
    touchGate() {
        this.scene.restart({fromGate:true});
    }
    update(time, delta) {
        this.now += delta;
    }
    spawn() {
        // This is "time on stage".
        let time = this.now;
        let rounds = (time + 1) / 15000;

        let gates = this.sys.registry.values.gates;
        let killed = this.sys.registry.values.killed;
        let shots = this.sys.registry.values.shots;
        let shotFactor = Math.max(1, Math.log10(shots));

        let target = Math.ceil(killed + gates + shotFactor + Math.pow(rounds, 1.5));
        // Enemy's last group is Mob; that *includes* the player!
        let outstanding = Enemy.LastGroup.group(this).getLength() - 1;
        let needs = target - outstanding;
        for (let i = 0; i < Math.min(gates, needs); ++i) {
            if (this.sys.registry.values.alive > 250) {
                this.scene.start('GameOver', { overrun:true });
            }
            this.add.existing(new Enemy(
                this,
                Phaser.Math.Between(16, this.map.widthInPixels - 16),
                Phaser.Math.Between(16, this.map.heightInPixels - 16),
            ));
        }

    }
}