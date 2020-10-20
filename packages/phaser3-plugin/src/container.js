import Managed from './managed';
import Parent from './parent';

export default class Container extends Parent(Managed) {
    _update(delta) {
        if (!super._update(delta)) { return false }
        this._onboardChildren();
        this._updateChildren(delta);
        return true;
    }
}