export default [
    function literal(obj, cbs, params) {
        if (obj.constructor !== Object) {
            return undefined;
        }
        return [cbs.literal, cbs.associative];
    },
    function array(obj, cbs, params) {
        if (!Array.isArray(obj)) {
            return undefined;
        }
        return [cbs.array, cbs.iterable];
    },
    function set(obj, cbs, params) {
        if (!(obj instanceof Set)) {
            return undefined;
        }
        return [cbs.set, cbs.iterable];
    },
    function map(obj, cbs, params) {
        if (!(obj instanceof Map)) {
            return undefined;
        }
        return [cbs.map, cbs.associative, cbs.iterable];
    },
    function iterable(obj, cbs, params) {
        if (!(Symbol.iterator in obj)) {
            return undefined
        }
        return [cbs.iterable];
    },
    function regExp(obj, cbs, params) {
        if (!(obj instanceof RegExp)) {
            return undefined;
        }
        return [cbs.regExp];
    },
];