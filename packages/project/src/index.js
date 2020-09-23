import obj from '@browndragon/obj';
import {Callable, switchType, zip} from '@browndragon/func';

/** Gets the value from o for each key (recursively) in t. */
class Project extends Callable {
    constructor() {
        super((o, t) => {
            return switchType(t, this, o);
        });
    }
    undefined(t, o) {
        // When the template is undefined, return any encountered object value ("no restriction").
        return o;
    }
    function(t, o) {
        // When the template is a function, return its result.
        return t(o);
    }
    value(t, o) {
        // When the template is a value, return o when it's equivalent.
        return t == o ? o : undefined;
    }
    regExp(t, o) {
        // When the template is a regex, return o when it matches.
        return t.test(o) ? o : undefined;
    }
    empty(t, o) {
        // When the template is an object with no entries, return an object with no entries
        // when o is present.
        return o == undefined ? undefined : {};
    }
    iterable(t, o) {
        // When the template is an iterable, return a new iterable recursing.
        // This feels VERY hard to work with! Consider f() instead...
        let result = [];
        for (let [ti, to] of zip(t, o)) {
            const res = this(ti, to);
            result.push(res == undefined ? undefined : res);
        }
        return result;
    }
    associative(t, o) {
        if (o == undefined) {
            return undefined;
        }
        let result = {};
        for (let [k, tv] of obj.entries(t)) {
            obj.set(result, k, this(obj.get(o, k), tv));
        }
        return result;
    }
    default(t, o) {
        throw `Unhandled template type: ${t} at ${o}`;
    }
}
export default new Project();