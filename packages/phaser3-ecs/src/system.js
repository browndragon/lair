import {System as BaseSystem} from '@browndragon/ecs';

export default class System extends BaseSystem {
    constructor(context) {
        super(context);
        this[S] = context.registry.scene;
    }
    get scene() { return this[S] }
    preload() {}
    create() {}
}
const S = Symbol('Scene');