import Tagger from '@browndragon/tag';
/**
 * Creates a (presumably per-character) line of dialog.
 *
 * ```
 * Line.tag`Stay a while, and listen!`;  // {text:'Stay a while, and listen!'};
 * ```
 *
 * ```
 * Line.tag({speaker:'meg', mood:'angry'})`Grr!`  // --> {text:'Grr!', speaker:'meg', mood:'angry'};
 * Line.tag`Grr!!` // -> --> {text:'Grr!!', speaker:'meg', mood:'angry'};
 * ```
 * Finally, you can hint that there's no spoken dialog with: `Line.tag({action:truthy})`, which produces an action (not a text).
 */
export default class Line extends Tagger {
    constructor(onComplete, attrs={}) {
        super(onComplete);
        this.attrs = {...attrs, text:undefined, action:undefined};
    }
    tag(text) { this.attrs.text = text }
    data({text, ...attrs}={}) { console.assert(!text); Object.assign(this.attrs, attrs); }
    next() { 
        if (this.attrs.text) { return this.attrs }
        if (this.attrs.action) { return this.attrs }
        return super.next();
    }
}