export default function switchType(obj, cbs, ...params) {
    const type = typeof(obj);
    let cb = undefined;
    switch(type) {
        case 'bigint':  // Fallthrough.
        case 'boolean':  // Fallthrough.
        case 'number':  // Fallthrough.
        case 'symbol': {
            for (cb of [cbs[type], cbs.value]) {
                if (cb) {
                    return cb.call(cbs, obj, ...params);
                }
            }
            break;
        }
        case 'string': {
            // This is an *iterable value type*.
            for (cb of [cbs.string, cbs.value, cbs.iterable]) {
                if (cb) {
                    return cb.call(cbs, obj, ...params);
                }
            }
            break;
        }
        case 'function': {
            for (cb of [cbs.function, cbs.value]) {
                if (cb) {
                    return cb.call(cbs, obj, ...params);
                }
            }
            break;
        }
        case 'undefined': {
            for (cb of [cbs.undefined, cbs.null]) {
                if (cb) {
                    return cb.call(cbs, obj, ...params);
                }
            }
        }
        case 'object': {
            if (type == 'object') {
                if (obj == null) {
                    for (cb of [
                        cbs.null,
                        cbs.undefined,
                    ]) {
                        if (cb) {
                            return cb.call(cbs, obj, ...params);
                        }
                    }
                    break;
                }

                // Okay. Everything else is some sort of object type. But it still might
                // be a recognized iterable type, or...?
                if (Array.isArray(obj)) {
                    if (cbs.array) {
                        return cbs.array(obj, ...params);
                    }
                }
                if (obj instanceof Map) {
                    if (cbs.map) {
                        return cbs.map(obj, ...params);
                    }
                    if (cbs.associative) {
                        return cbs.associative(obj, ...params);
                    }
                }
                if (obj instanceof Set) {
                    if (cbs.set) {
                        return cbs.set(obj, ...params);
                    }
                }
                if (Symbol.iterator in obj) {
                    if (cbs.iterable) {
                        return cbs.iterable(obj, ...params);
                    }
                }
                if (obj instanceof RegExp) {
                    if (cbs.regExp) {
                        return cbs.regExp(obj, ...params);
                    }
                }
                if (obj.constructor === Object) {
                    let hadAny = false;
                    for (let i in obj) {
                        hadAny = true;
                        break;                        
                    }
                    if (!hadAny) {
                        if (cbs.empty) {
                            return cbs.empty(obj, ...params);
                        }
                    }
                    if (cbs.literal) {
                        return cbs.literal(obj, ...params);
                    }
                    if (cbs.associative) {
                        return cbs.associative(obj, ...params);
                    }
                }
                if (cbs.object) {
                    return cbs.object(obj, ...params);
                }
            }
        }
    }
    if (cbs.default) {
        return cbs.default(obj, ...params);
    }
    return undefined;
}