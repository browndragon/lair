import Callable from '@browndragon/callable';

import Tagger from '@browndragon/tag';

/**
 * Offers a single option up via convenient tag string format.
 * Attributes: The constructor accepts either single letter or fully spelled out form.
 * * b|ody: Value or evaluated value is shown after user input selects this option.
 * * c|hildren: An array of Option children.
 * * e|lse: If set, this option is taken once all other r|epeatable nodes at its level are exhausted.
 * * f|inally: If set, this "option" is actually a join point, automatically.
 * * h|ead: Value or evaluated value is shown before delaying for user input.
 * * i|f: If set & falsey or evaluates falsey, this option should be hidden from output.
 * * l|abel: Used as a canonical key for this option from various systems.
 * * out|link: When body is shown, if present, this is inlined *and returned* (so that it is transitioned into).
 * * r|epeatable: If truthy, the option isn't cleared once chosen. (most options are!)
 *
 * Restrictions:
 * * At most 1 of out & children
 * * At most 1 of else, finally, if, repeatable.
 */
export default class Option {
    constructor(attrs={}) {
        this._body = attrs.body | attrs.b;
        this._outlink = attrs.out | attrs.outlink;
        this._children = attrs.children | attrs.cs | attrs.c;
        this._else = attrs.else | attrs.e;
        this._finally = attrs.finally | attrs.f;
        this._head = attrs.head | attrs.h;
        this._if = attrs.if | attrs.i;
        this._label = attrs.label | attrs.l;
        this._repeatable = attrs.repeatable | attrs.r;

        console.assert([this._children, this._outlink].filter(Boolean).length <= 1);
        console.assert([this._if, this._else, this.finally, this.repeatable].filter(Boolean).length <= 1);

        // Now: fix up (or provide for someone else to fix up)
        this._aimlessChildren = new Set();
        for (let child of (this._children || [])) {
            if (!child.outlink || child._aimlessChildren.size) {
                this._aimlessChildren.add(child);
            }
        }
    }
    get body() { return val(this._body) }
    get children() {}
    get head() { return val(this._if) ? val(this._head) : undefined }
    get outlink() {
        // By the time you examine this, it *should* be set.
        if (this._outlink === undefined) {
            console.warn('Ungrounded outlink', this);
        }
        return this._outlink;
    }
}

function val(v) {
    if (typeof(v) == 'function') { return v() }
    return v;
}