export default function Registrar(clazz) {
    if (clazz.group) {
        console.warn(clazz, 'already supports registrar');
        return clazz;
    }
    return class extends clazz {
        /** Returns the group this class describes, installing it if necessary via `install()`. */
        static group(scene) {
            return this.peek(scene) || this.install(scene);
        }
        /** Returns the group this class describes IFF it's already been created; else undefined. */
        static peek(scene) {
            return registry(scene).get(this)
        }
        /** Creates and installs this club's group, whether or not it's been installed before. */
        static install(scene) {
            let group = new this(scene);
            registry(scene).set(this, group);
            scene.add.existing(group);
            return group;
        }

        destroy(...params) {
            if (this.scene) {
                let reg = registry(this.scene);
                if (reg) {
                    reg.delete(this.constructor)
                }
            }
            super.destroy(...params);
        }
    };
}

const SingletonGroups = Symbol('SingletonGroups');
/** Internal method; fetches the map of clubs -> groups. */
function registry(scene) {
    let reg = scene[SingletonGroups];
    if (reg) {
        return reg;
    }
    scene[SingletonGroups] = reg = new Map();
    scene.events.once('shutdown', (sys) => scene[SingletonGroups] = undefined);
    return reg;
}
