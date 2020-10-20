// import Phaser from 'phaser';
import consts from './consts';

/**
 * A generic "updatable" manager.
 *
 *
 */
export default class Manager extends Phaser.Plugins.ScenePlugin {
    constructor(scene, pluginManager) {
        super(scene, pluginManager);
        this.systems = scene.systems;
        this.timeScale = 1;
        this._add = new Set();
        this._pending = new Set();
        this._active = new Set();
        this._destroy = new Set();
        this.sys.events.once(Phaser.Scene.Events.BOOT, this.boot, this);
        this.scene.sys.events.on(SceneEvents.START, this.start, this);
    }

    add(config) {
        return this.existing(this.create(config));
    }
    create(config) {
        throw 'unimplemented';
    }
    existing(constraint) {
        this._add.add(constraint);
        return constraint;
    }
    remove(constraint) {
        this._add.delete(constraint);
        this._pending.delete(constraint);
        this._active.delete(constraint);
        this._destroy.delete(constraint);
        constraint.state = consts.REMOVED;
    }
    removeAll() {
        for (let constraint of this._active) {
            constraint.stop();
        }
        return this;
    }

    pauseAll() {
        for (let constraint of this._active) {
            constraint.pause();
        }
        return this;
    }
    resumeAll() {
        for (let constraint of this._active) {
            constraint.resume();
        }
        return this;
    }
    makeActive(constraint) {
        if (this._add.has(constraint) || this._active.has(constraint)) {
            return this;
        }
        this._pending.delete(constraint);
        this._add.add(constraint);
        constraint.state = consts.PENDING_ADD;
        return this;
    }
    getGlobalTimeScale() {
        return this.timeScale;
    }
    setGlobalTimeScale(timeScale) {
        this.timeScale = timeScale;
        return this;
    }

    values() {
        return Array.from(this._active);
    }
    [Symbol.iterator]() {
        return this._active[Symbol.iterator]();
    }

    // Plugin-y scene lifecycle methods.
    boot() {
        this.systems.events.once(SceneEvents.DESTROY, this.destroy, this);
    }
    start() {
        var eventEmitter = this.systems.events;

        eventEmitter.on(SceneEvents.PRE_UPDATE, this.preUpdate, this);
        eventEmitter.on(SceneEvents.UPDATE, this.update, this);
        eventEmitter.once(SceneEvents.SHUTDOWN, this.shutdown, this);

        this.timeScale = 1;
    }
    preUpdate() {
        if (this._add.size == 0 && this._destroy.size == 0) {
            return;
        }
        for (let constraint of this._destroy) {
            if (this._active.delete(constraint)) {
                constraint.state = consts.REMOVED;
            } else if (this._pending.delete(constraint)) {
                constraint.state = consts.REMOVED;
            }
        }
        this._destroy.clear();
        for (let constraint of this._add) {
            if (constraint == consts.PENDING_ADD) {
                if (constraint.init()) {
                    contraint.play();
                    this._active.add(constraint);
                } else {
                    this._pending.add(constraint);
                }
            }
        }
    }
    update(timestamp, delta) {
        //  Scale the delta
        delta *= this.timeScale;
        for (let constraint of this._active) {
            if (constraint.update(timestamp, delta) == consts.COMPLETED) {
                this._destroy.push(constraint);
            }
        }
    }
    shutdown() {
        this.killAll();
        this._add = new Set();
        this._pending = new Set();
        this._active = new Set();
        this._destroy = new Set();
        let eventEmitter = this.systems.events;
        eventEmitter.off(SceneEvents.PRE_UPDATE, this.preUpdate, this);
        eventEmitter.off(SceneEvents.UPDATE, this.update, this);
        eventEmitter.off(SceneEvents.SHUTDOWN, this.shutdown, this);
    }
    destroy() {
        this.shutdown();
        this.scene.sys.events.off(SceneEvents.START, this.start, this);
        this.scene = null;
        this.systems = null;
    }
}