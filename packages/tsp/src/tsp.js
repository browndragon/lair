//    import Phaser from 'phaser';
import ImportLambdas from './importLambdas';

/** Automatically runs `update`, `postUpdate`, `tick` (physics update, per step) and `postTick` (physics update, per step) methods. */
export default class TSP extends Phaser.Plugins.ScenePlugin {
    boot () {
        const events = this.systems.events;

        this.objs = {
            // Use the built-in phaser update list rather than maintaining our own:
            // update: new Phaser.Structs.Set(),

            postUpdate: new Phaser.Structs.Set(),

            tick:  new Phaser.Structs.Set(),
            postTick:  new Phaser.Structs.Set(),
        };

        events.on('start', this.sceneStart, this);
        // events.on('update', this.sceneUpdate, this);
        events.on('postupdate', this.scenePostUpdate, this);
        events.on('shutdown', this.sceneShutdown, this);
        events.once('destroy', this.sceneDestroy, this);
    }

    sceneStart () {
        // The world is defined in physics' `boot`, so this has to delay until after then.
        if (this.systems.arcadePhysics && this.systems.arcadePhysics.world) {
            this.systems.arcadePhysics.world.on('worldstep', this.sceneTick, this);
        }

        // Similarly, might as well reach across into other systems here...
        this.systems.updateList.on('add', this.add, this);
        this.systems.updateList.on('remove', this.remove, this);

        // if (this.scene.update) { this.updaters.add(this.scene) }    // Handled by Phaser.
        if (this.scene.postUpdate) { this.objs.postUpdate.set(this.scene) }
        if (this.scene.tick) { this.objs.tick.set(this.scene) }
        if (this.scene.postTick) { this.objs.postTick.set(this.scene) }
    }

    // sceneUpdate (time, delta) {
    //     this.objs.update.each(obj => obj.update(time, delta));
    // }

    scenePostUpdate(time, delta) {
        this.objs.postUpdate.each(obj => obj.postUpdate(time, delta));
    }

    sceneTick(delta) {
        this.objs.tick.each(obj => obj.tick(delta));
        this.objs.postTick.each(obj => obj.postTick(delta));
    }

    sceneShutdown () {
        for (let set of Object.values(this.objs)) {
            set.clear();
        }
    }

    sceneDestroy () {
        const events = this.systems.events;

        events.off('start', this.sceneStart, this);
        if (this.systems.arcadePhysics && this.systems.arcadePhysics.world) {
            this.systems.arcadePhysics.world.off('worldstep', this.sceneTick, this);
        } 
        if (this.systems.updateList) {
            this.systems.updateList.off('add', this.add, this);
            this.systems.updateList.off('remove', this.remove, this);
        }
        // events.off('update', this.sceneUpdate, this);

        events.off('postupdate', this.scenePostUpdate, this);
        events.off('shutdown', this.sceneShutdown, this);
        events.off('destroy', this.sceneDestroy, this);

        this.gameObjects = null;
        this.scene = null;
        this.systems = null;
    }

    add (obj) {
        obj.once('destroy', this.remove, this);
        // if (obj.update) { this.objs.updaters.set(obj) }
        if (obj.postUpdate) { this.objs.postUpdate.set(obj) }
        if (obj.tick) { this.objs.tick.set(obj) }
        if (obj.postTick) { this.objs.postTick.set(obj) }
        return obj;
    }

    addMultiple (objs) {
        objs.forEach(this.add, this);
        return objs;
    }

    remove (obj) {
        obj.off('destroy', this.remove, this);
        for (let set of Object.values(this.objs)) {
            set.delete(obj);
        }
        return obj;
    }
}
TSP.installClause = { key: '_tsp', mapping: '_tsp', plugin: TSP};

/** Adds a lambda to be run when all preloads are run. */
TSP.preload = new ImportLambdas();
/** Adds a lambda to be run when all creates are run. */
TSP.create = new ImportLambdas();
