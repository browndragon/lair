import {Registry} from '@browndragon/ecs';
// Peer dependency, don't import or you'll get a second copy! Use the global instead.
// import Phaser from 'phaser';

export default class Scene extends Phaser.Scene {
    constructor(...params) {
        super(...params);
        this[R] = new Registry();
    }
    addSystem(System) {
        this[R].addSystem(System, this);
        return this;
    }

    preload() {
        this[R].forEach(preload);
    }
    create() {
        this[R].forEach(create);
    }
    update(time, delta) {
        this[R].update({time, delta});
    }
}
function preload(s) { s.preload() }
function create(s) { s.create() }

const R = Symbol('Registry');