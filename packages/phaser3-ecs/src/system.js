import {System as BaseSystem} from '@browndragon/ecs';

export default class System extends BaseSystem {
    constructor(registry, scene) {
        super(registry);
        this.scene = scene;
    }
    preload() {}
    create() {}
}