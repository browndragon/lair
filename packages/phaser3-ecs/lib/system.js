import Scene from './scene';
import { System as BaseSystem } from '@browndragon/ecs';

export default class System extends BaseSystem {
    constructor(registry, scene) {
        super(registry);
        this.scene = scene;
    }
    preload() {}
    create() {}

    /** The ECS Scene class exposed as a courtesy/to improve discoverability. */
    static get Scene() {
        return Scene;
    }
}