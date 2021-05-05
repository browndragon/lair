import embody from './embody';
import facer from './facer';
import scoped from './scoped';

export default function walker(clazz) {
    return class extends facer(scoped(clazz)) {
        get infix() {
            return (this.body && this.body.velocity.lengthSq() > 1) ? 'walk' : 'stand';
        }
        get suffix() {
            return this.facingQuadrant;
        }
        walkAlong(vector) {
            this.body.velocity.setFromObject(vector);
            if (vector.lengthSq() > 1) {
                this.facingVector = vector;
            }
            this.play(undefined, true);
        }
        addedToScene() {
            super.addedToScene();
            embody(this);
        }
    };
}
