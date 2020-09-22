/**
 * Very similar to array destructuring, returns an array whose first element is the
 * "rest" parameter, and whose trailing elements are the rightmost elements of the array.
 * The default invocation is like a nondestructive `pop` (returning an array of two elements: a) the new array of the frontmost n-1 elements and b) the last element):
 * `const [prefix, elem[-(n)], ...last[-1]] = destructureRight(array, n)`
 * Because this is intended to be used for destructuring assignment, it omits undefined right-
 * hand elements (the destructuring assignment will backfill undefined/defaults as appropriate).
 */
export default function destructureRight(array, elements=1) {
    return [
        array.slice(0, Math.max(0, array.length - elements)),
        ...array.slice(array.length - elements)
    ];
}
