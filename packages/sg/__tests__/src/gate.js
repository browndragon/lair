import Phaser from 'phaser';
import SG from '@browndragon/sg';

export default class Gate extends SG.Member(
    Phaser.Physics.Arcade.Image,
    class extends SG.Overlap {
        get intersects() { return [Gate.Collides] }
        intersect(gate, player) {
            gate.scene.touchGate();
        }
    },
) {
    constructor(scene, x, y) {
        super(scene, x, y, `gate`);
    }
    addedToScene() {
        super.addedToScene();
        this.scene.sys.registry.inc('gates');
        this.depth = +1;
        this.scene.tweens.addCounter({
            from: 192,
            to: 255,
            yoyo: true,
            duration: 3000 - 200 * this.scene.sys.registry.values.gates,
            repeat: -1,
            onUpdate: (tween) => {
                const value = Math.floor(tween.getValue());
                this.setTint(Phaser.Display.Color.GetColor(value, value, value));
            },
            onComplete: () => this.stopHurt(),
        });
    }
}
Gate.Collides = class extends SG.PGroup {}
Gate.preload = function(scene) {
    const tmpl = {pixelWidth: 4, pixelHeight: 4};
    const tmpl2 = {pixelWidth: 1, pixelHeight: 1};
    scene.textures.generate('gate', {...tmpl, data:`
        ..FFFF..
        .FEEEEF.
        FEF22FEF
        FEF22FEF
        FEF22FEF
        FEF22FEF
        FEF22FEF
        FEF22FEF
    `.split('\n').map(s => s.trim()).filter(Boolean)});
    let s = scene.textures.generate('flares', {...tmpl2, data:`
        .FF..FF..FF..FF.
        FEEFF22FFE2FF2EF
        .FF..FF..FF..FF.
    `.split('\n').map(s => s.trim()).filter(Boolean)});
    for (let i = 0; i < 4; ++i) {
        s.add(i, 0, i * 4, 0, 4, 3);
    }
};