// import Phaser from 'phaser';
import consts from './consts';
import Managed from './managed';

/**
 * A generic "updatable" manager.
 * You must subclass this to support, at minimum, `.create` which creates new instances of
 * your managed class.
 *
 * Each Managed has some freestanding state, and must support operations to:
 * * resume: Expect to receive update calls (including starting the ).
 * * update: A tick is updated, along with elapsed time and scaled tick.
 * * pause: Expect to no longer receive update calls.
 * It's possible to pause/resume multiple times.
 * Each Managed has some additional methods it should expect to have invoked:
 * 
 */
export default class Manager extends Phaser.Plugins.ScenePlugin {
    constructor(scene, pluginManager) {
        super(scene, pluginManager);
        this.systems = scene.systems;
        this.timeScale = 1;

        /** Upcoming Manageds to start updating. */
        this._add = new Set();

        /** Manageds which have been added, but are paused. */
        this._pending = new Set();

        /** Manageds which are added and active. */
        this._active = new Set();

        /** Manageds which are going away. */
        this._destroy = new Set();

        this.sys.events.once(Phaser.Scene.Events.BOOT, this.boot, this);
        this.scene.sys.events.on(SceneEvents.START, this.start, this);
    }

    /** Creates & adds a new managed, following config. By default, immediately resumes. */
    add(config) {
        let managed = this.create(config);
        this.existing(managed);
        return managed;
    }
    /** IMPLEMENTME! Creates a new instance of Managed child of this. */
    create(config) {
        // return new MyManagedType(this, config);
        throw 'IMPLEMENTME!';
    }
    /** Adds an already existing managed instance to this manager. By default, immediately resumes. */
    existing(managed) {
        console.assert(managed.parent == this);
        this._add.add(managed);
        return this;
    }

    /** Stops & removes a running managed instance. `Expunge` takes effect immediately, removing the object from all possible states. */
    remove(managed, expunge) {
        console.assert(managed.parent == this);
        if (expunge) {
            this._add.delete(managed);
            this._pending.delete(managed);
            this._active.delete(managed);
            this._destroy.delete(managed);
            return this;
        }
        this._destroy.add(managed);
        return this;
    }
    /** Empties this manager (such as on scene shutdown). */
    removeAll() {
        for (let managed of this._active) {
            this.stop(managed);
        }
        return this;
    }

    /** Moves a managed from playing to paused. If it's not already playing, do nothing. */
    pause(managed) {
        console.assert(managed.parent == this);
        if (this._pending.has(managed)) {
            // If already paused, do nothing.
            return this;
        }
        if (this._active.delete(managed)) {
            // If it was playing, move to pending.
            this._pending.add(managed);
        }
        return this;
    }
    /** Pauses playback for all managed objects. */
    pauseAll() {
        for (let managed of this._active) {
            this.pause(managed);
        }
        return this;
    }

    /** Moves a managed back into playing. If it hasn't been played before, this adds it. */
    resume(managed) {
        console.assert(managed.parent == this);
        this._pending.delete(managed);
        this._add.add(managed);
        return this;
    }
    /** Unpauses everything that's paused. */
    resumeAll() {
        for (let managed of this._pending) {
            this.resume(managed);
        }
        return this;
    }

    getGlobalTimeScale() {
        return this.timeScale;
    }
    setGlobalTimeScale(timeScale) {
        this.timeScale = timeScale;
        return this;
    }
    /** 
    pausedValues() {
        return Array.from(this._pending);
    }
    /** Iterator method over Managed instances. */
    playingValues() {
        return Array.from(this._active);
    }
    /** Iterator method over Managed instances. */
    [Symbol.iterator]() {
        return this._active[Symbol.iterator]();
    }

    /** Plugin scene lifecycle event. Do not call; automatically invoked. */
    boot() {
        this.systems.events.once(SceneEvents.DESTROY, this.destroy, this);
    }
    /** Plugin scene lifecycle event. Do not call; automatically invoked. */
    start() {
        var eventEmitter = this.systems.events;

        eventEmitter.on(SceneEvents.PRE_UPDATE, this.preUpdate, this);
        eventEmitter.on(SceneEvents.UPDATE, this.update, this);
        eventEmitter.once(SceneEvents.SHUTDOWN, this.shutdown, this);

        this.timeScale = 1;
    }
    /** Plugin scene lifecycle event. Do not call; automatically invoked. */
    preUpdate() {
        if (this._add.size == 0 && this._destroy.size == 0) {
            return;
        }
        for (let managed of this._destroy) {
            this._active.delete(managed);
            this._pending.delete(managed);
        }
        this._destroy.clear();
        for (let managed of this._add) {
            if (managed.init()) {
                this._active.add(managed);
            } else {
                this._pending.add(managed);
            }
        }
        this._add.clear();
    }
    /** Plugin scene lifecycle event. Do not call; automatically invoked. */
    update(timestamp, delta) {
        //  Scale the delta
        let frameDelta = this.timeScale;
        let timeDelta = delta * frameDelta;
        for (let managed of this._active) {
            let useDelta = managed.useFrames ? frameDelta : timeDelta;
            managed._update(useDelta);
        }
    }
    /** Plugin scene lifecycle event. Do not call; automatically invoked. */
    shutdown() {
        this.killAll();
        this._add.clear();
        this._pending.clear();
        this._active.clear();
        this._destroy.clear();
        let eventEmitter = this.systems.events;
        eventEmitter.off(SceneEvents.PRE_UPDATE, this.preUpdate, this);
        eventEmitter.off(SceneEvents.UPDATE, this.update, this);
        eventEmitter.off(SceneEvents.SHUTDOWN, this.shutdown, this);
    }
    /** This isn't usually necessary to call, but: turns off this manager, stopping further updates & events. */
    destroy() {
        this.shutdown();
        this.scene.sys.events.off(SceneEvents.START, this.start, this);
        this.scene = null;
        this.systems = null;
    }
}