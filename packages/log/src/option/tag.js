import Tagger from '@browndragon/tag';
import Option from './option';
/**
 * A tag builder for options. In particular, allows the pattern:
 * repeatable method call of a single object which contains attributes. Optional.
 * 1-3 tag expressions which (mutually) derive head & body. Optional (, if the attributes were already provided).
 * method call containing the tail (which might be `()`, might be `(...children)`, or might be `(function outlink())`). Required, and recognizable since none of these forms match attributes.
 */
export default class Tag extends Tagger {
    constructor() {
        super();
        this.tags = [];
        this.done = false;
    }
    tag(s) {
        this.tags.push(s);
    }
    data(...datas) {
        if (datas.length <= 0 || datas[0] === undefined) {
            // This is a fallthrough node; it was closed (yay) but 
            return;
        }
        if (datas[0] === null) {
            // It's *intentionally* dying here, no jump.
            this.tail = null;
            this.done = true;
            return;
        }
        if (datas[0] instanceof Option || datas[0] instanceof Option.Record) {
            // It's a run of additional Options, statically defining a next state.
            // TODO: Handle the case 
            this.tail = datas;
            this.done = true;
            return;
        }
        if (typeof(datas[0]) == 'function') {
            console.assert(datas.length == 1);
            // It's some *other* function, assumed to be a state.
            this.tail = datas[0];
            this.done = true;
            return;
        }
    }
    get head() {
        switch(this.tags.length) {
            case 0: return '';
            case 1: // Fallthrough
            case 2: return this.tags[0];
            case 3: return this.tags[0] + this.tags[1];
            default: throw 'Too many tags!';
        }
    }
    get body() {
        switch(this.tags.length) {
            case 0: return '';
            case 1: return this.tags[0]
            case 2: return this.tags[1];
            case 3: return this.tags[0] + this.tags[2];
            default: throw 'Too many tags!';            
        }
    }

}