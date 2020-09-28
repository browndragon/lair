import {Registry as BaseRegistry} from '@browndragon/ecs';

export default class Registry extends BaseRegistry {
    constructor(scene) {
        super();
        this.scene = scene;
    }
}