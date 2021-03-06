/** Adds the named gameObject to each of the variadic arg sgs. */
export default function induct(gameObject, ...sgs) {
    console.assert(gameObject);
    const scene = gameObject.scene;
    console.assert(scene);
    for (let sg of sgs) {
        console.assert(sg);
        let group = sg.group(scene);
        console.assert(group);
        group.add(gameObject);
    }
    return gameObject;
}
