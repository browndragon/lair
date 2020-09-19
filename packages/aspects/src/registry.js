import {Table} from '@browndragon/collections';

export default class Registry {
    constructor() {
        this.aspects = new Map();
    }

    register(Aspect, ...params) {
        this.aspects.set(Aspect, new Aspect(this, ...params));
        return this;
    }
    unregister(Aspect) {
        this.data.deleteCol(this.aspect(Aspect),
            (data, [instance, aspect]) => aspect.unbound(data, instance)
        );
        this.aspects.delete(Aspect);
        return this;
    }
    aspect(Aspect) {
        const aspect = this.aspects.get(Aspect);
        console.assert(aspect);
        return aspect;
    }
    forEach(cb) {
        this.aspects.forEach(cb);
    }
    forget(instance) {
        for (let aspect of this.aspects.values()) {
            aspect.unbind(instance);
        }
        return this;
    }
}
