import {Aspect as BDAspect} from '@browndragon/aspects';

export default class Aspect extends BDAspect {
    constructor(registry, scene) {
        super(registry);
        this.scene = scene;
        this.initData = scene.sys.getData();
    }

    preload() {}
    create() {}

    update(time, delta) { return undefined; }
    updateInstance(update, instance, data) {}
}