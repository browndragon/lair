import obj from '@browndragon/obj';

export default function get(o, ...path) {
    for (let p in path) {
        o = obj.get(o, p);
        if (o == undefined) {
            return o;
        }
    }
    return o;
}