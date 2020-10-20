/**
 * An object which can be put into a manager (like a managed) but which can be a parent of managed objects (like a manager).
 */
export default function Parent(clazz) {
    if (clazz[S]) {
        return clazz;
    }
    return class extends clazz {
        static get [S]() { return true }
        constructor(...params) {
            super(...params);

            /** Upcoming Manageds to add to the system (pending or active). */
            this._add = new Set();
            /** Manageds which are going away. */
            this._destroy = new Set();
            /** Manageds which have been added, but are paused. */
            this._pending = new Set();
            /** Manageds which are added and active. */
            this._active = new Set();

            this.timeScale = 1;

            /** Operations that apply across all manageds in the system. */
            this.all = new All(this._active, this._pending);
        }

        /** IMPLEMENTME! Creates a new instance of Managed child of this. */
        create(_config) {
            // return new MyManagedType(this, _config);
            throw 'IMPLEMENTME!';
        }
        /** Creates & adds a new managed, following config. */
        add(config) {
            let managed = this.create(config);
            this.existing(managed);
            return managed;
        }
        /** Adds an already existing managed instance to this manager during the next preUpdate (pending or active). */
        existing(managed) {
            console.assert(managed.parent == this);
            managed.state.reset('PENDING_ADD');
            return managed;
        }

        /** Called by lifecycle for you. */
        _onboardChildren() {
            if (this._add.size == 0 && this._destroy.size == 0) {
                return;
            }
            for (let managed of this._destroy) {
                managed.destroy();
            }
            for (let managed of this._add) {
                if (managed.init()) {
                    managed.play();
                } else {
                    managed.pause();
                }
            }
        }

        /** Called by lifecycle for you. */
        _updateChildren(delta) {
            //  Scale the delta
            let frameDelta = this.timeScale;
            let timeDelta = delta * frameDelta;
            for (let managed of this._active) {
                let useDelta = managed.useFrames ? frameDelta : timeDelta;
                managed._update(useDelta);
            }
        }

        shutdown() {
            this.all.stop();
            this._add.clear();
            this._pending.clear();
            this._active.clear();
            this._destroy.clear();        
        }

    };
}
const S = Symbol('Parent');

/** Operations that apply across all manageds in the system. */
class All {
    constructor(active, pending) {
        this._active = active;
        this._pending = pending;
    }
    /** Pause all active manageds. */
    pause() {
        for (let managed of this._active) {
            managed.pause();
        }
    }
    get paused() {
        return this._pending;
    }
    /** Resume all paused manageds. */
    resume() {
        for (let managed of this._pending) {
            managed.resume();
        }
    }
    get playing() {
        return this._active;
    }
    /** Stop all active and paused manageds. */
    stop() {
        for (let managed of this._active) {
            managed.stop();
        }
        for (let managed of this._pending) {
            managed.stop();
        }
    }
    /** Synonym of `stop`. */
    kill() {
        return this.stop();
    }
}