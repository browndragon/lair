import {Registry} from '@browndragon/aspects';

export default class Plugin extends Phaser.Plugins.ScenePlugin {
    constructor(scene, pluginManager) {
        this.scene = scene;
        this.systems = scene.sys;
        if (!this.systems.settings.isBooted) {
            this.systems.events.once('boot', () => this.boot());
        }
        this.registry = new Registry({scene});
    }
    static register(PluginManager) {
        // Is this really called?!
        PluginManager.register(
            // Name in the pluginManager
            'BasePlugin',
            // self reference
            BasePlugin,
            // `this.sys` key; also `this` key.
            'base'
        );
    }
    register(Aspect, ...params) {
        this.registry.register(Aspect, this.scene, ...params);
    }

    //  Called when the Plugin is booted by the PluginManager.
    //  If you need to reference other systems in the Scene (like the Loader or DisplayList) then set-up those references now, not in the constructor.
    boot() {
        let eventEmitter = this.systems.events;

        //  Listening to the following events is entirely optional, although we would recommend cleanly shutting down and destroying at least.
        //  If you don't need any of these events then remove the listeners and the relevant methods too.
        eventEmitter.on('start', this.start, this);

        eventEmitter.on('preupdate', this.preUpdate, this);
        eventEmitter.on('update', this.update, this);
        eventEmitter.on('postupdate', this.postUpdate, this);

        eventEmitter.on('pause', this.pause, this);
        eventEmitter.on('resume', this.resume, this);

        eventEmitter.on('sleep', this.sleep, this);
        eventEmitter.on('wake', this.wake, this);

        eventEmitter.on('shutdown', this.shutdown, this);
        eventEmitter.on('destroy', this.destroy, this);
    }

    //  Called when a Scene is started by the SceneManager. The Scene is now active, visible and running.
    start() {
        this.scene.load.once(Phaser.Loader.COMPLETE, () => {
            this.registry.forEachAspect((aspect) => aspect.create());            
        });
        // TODO: Is this needed?
        // this.scene.load.once(Phaser.Loader.START, () => {});
        this.registry.forEachAspect((aspect) => aspect.preload());
    }

    //  Called every Scene step - phase 1
    preUpdate(time, delta) {
    }

    //  Called every Scene step - phase 2
    update(time, delta) {
        this.registry.forEachAspect((aspect) => {
            let update = aspect.update(time, delta);
            if (!update) {
                return;
            }
            aspect.forEach(
                (aspect, instance, data) => aspect.updateInstance(update, instance, data)
            );
        });
    }

    //  Called every Scene step - phase 3
    postUpdate(time, delta) {
    }

    //  Called when a Scene is paused. A paused scene doesn't have its Step run, but still renders.
    pause() {
    }

    //  Called when a Scene is resumed from a paused state.
    resume() {
    }

    //  Called when a Scene is put to sleep. A sleeping scene doesn't update or render, but isn't destroyed or shutdown. preUpdate events still fire.
    sleep() {
    }

    //  Called when a Scene is woken from a sleeping state.
    wake() {
    }

    //  Called when a Scene shuts down, it may then come back again later (which will invoke the 'start' event) but should be considered dormant.
    shutdown() {
    }

    //  Called when a Scene is destroyed by the Scene Manager. There is no coming back from a destroyed Scene, so clear up all resources here.
    destroy() {
        this.shutdown();
        this.scene = undefined;
    }

}
