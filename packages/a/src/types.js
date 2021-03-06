import val from './val';

export class Base extends ContextCallable {
    constructor(self) {
        super(self);
    }
}
/**
 * When this node is evaluated, its text is printed and then it returns undef.
 */
export class Log extends Base {
    constructor(text, next) {
        super(() => { this.ctx._log(val(text)); return next });
    }
}
export class Opt extends Base {}
/** When this node is evaluated it populates a choice targeting the eventual result... */
export class Label extends Opt {
    constructor(text, next, cond, repeat, fallback) {
        super(() => {
            if (this.isHidden()) { return undefined }
            this.ctx._ifthenfinally(val(text), next, fallback);
        });
        this.next = next;
        this.cond = cond;
        this.repeat = repeat;
    }
    isHidden() {
        if (!this.repeat && this.ctx.count(this.next)) { return true }
        if (this.cond && !this.cond()) { return true }
        return false;
    }
}
/** When this node is evaluated it sets a fallback for all Grams, Labels & Monds in its scope. */
export class Mond extends Opt {
    constructor(next) {
        super(() => this.inline(next));
    }
}
/** When this node is evaluated it inlines each Label in turn, then inlines displaying that to the user. */
export class Gram extends Opt {
    constructor(...opts) {
        super(null);
    }
}
/** When this node is evaluated, it escapes the containing gram. */
export class Gonal extends Base {
    constructor() {}
}
