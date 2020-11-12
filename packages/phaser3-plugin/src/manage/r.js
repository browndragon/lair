import Play from './play';
import Qs from './qs';

/**
 * Implements a manage-r mixin which has several internal queues and can move objects between them.
 * These are canonical: methods on the actual managed objects like start, stop (etc) refer to the manager's implementations!
 */
export default clazz => clazz[F.mixin] ? clazz : class extends clazz {
    static get [F.mixin]() { return true }
    constructor(...params) {
        super(...params);
        this[F.qs] = new Qs();
        this[F.play] = player;
    }
    preUpdate() {
        for (let t of this[F.qs].terminating) {
            this[F.play].stop(t);
            this[F.qs].kill(t);
        }
        this[F.qs].terminating.clear();
        for (let p of this[F.qs].pending) {
            if (this[F.play].init(t)) {
                this[F.qs].resume(t);                
            } else {
                this[F.qs].suspend(t);
            }
        }
        this[F.qs].pending.clear();
    }

    update(accumulated, tick) {
        for (let t of this[F.qs].active) {
            this[F.play].update(accumulated, tick);
        }
    }
};
const player = new Play();
export const F = {
    mixin: Symbol('Manager.Mixin'),
    qs: Symbol('Manager.Queues'),
    play: Symbol('Manager.Play'),
    preUpdate: Symbol('Manager.PreUpdate'),
    update: Symbol('Manager.Update'),
};
