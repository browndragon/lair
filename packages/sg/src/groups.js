export default function groups(scene, ...gs) {
    return gs.map(g => assertSafe(g.group(scene)));
}
function assertSafe(g) {
    console.assert(
        // Relies on someone else already importing Phaser for us. We can't do it here, because npm imports mean we'd get a different definition of Phaser than the invoker would!
        (g instanceof Phaser.Physics.Arcade.Group)
        || (g instanceof Phaser.Physics.Arcade.StaticGroup)
    );
    return g;
}