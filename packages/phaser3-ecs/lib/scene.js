import Registry from './registry';
// Peer dependency, don't import or you'll get a second copy! Use the global instead.
// import Phaser from 'phaser';

export default class Scene extends Phaser.Scene {
    constructor(...params) {
        super(...params);
        this[R] = new Registry(this);
    }
    runSystem(System) {
        this[R].add(System);
        return this;
    }
    addEntity(gameObject, pin = undefined) {
        this[R].observe(gameObject, pin);
    }
    removeEntity(gameObject) {
        this[R].remove(gameObject);
    }

    preload() {
        this[R].forEach(preload);
    }
    create() {
        this[R].forEach(create);
    }
    update(time, delta) {
        this[R].update({ time, delta });
    }
}
function preload(s) {
    s.preload();
}
function create(s) {
    s.create();
}

const R = Symbol('Registry');