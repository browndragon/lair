import Callable from '@browndragon/callable';
import destructure from '@browndragon/destructure';

export default class Choice extends Callable {
    constructor(name, head, body) {
        super(body);
        this._shouldShow = shouldShow;
        this._head = head;
    }
    get head() {
        if (this._shouldShow && !this._shouldShow()) {
            return undefined;
        }
        return this._head;
    }
}
Choice.Set = class ChoiceSet extends Callable {
    constructor(...choices) {
        super((function(thiz, choice) { 
            return thiz.choose(this, choice)
        }).bind(undefined, this));
        this._choices = choices;
    }
    fallback(fallback) {
        this._fallback = fallback;
        return this;
    }
    choose(thiz, choice) {
        let stateMachine = this;
        let choiceSet = thiz;
        if (!choice) {

        }
    }

}