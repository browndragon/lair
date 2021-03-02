/** Returns true if we strongly believe the parameters to be tagged template string-y. */
export default function isTagExpr(strings, params) {
    return Array.isArray(strings) && strings.raw
}
    