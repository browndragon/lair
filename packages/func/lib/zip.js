/**
 * Like python zip, sticks two arrays together.
 * Operates at the length of the *first* argument; absent entries get undefined.
 */
export default function zip(...arrays) {
    if (arrays.length == 0) {
        return [];
    }
    let artoo = arrays.map(x => Array.isArray(x) ? x : Array.from(x));
    return artoo[0].map((_, i) => artoo.map(array => array[i]));
}