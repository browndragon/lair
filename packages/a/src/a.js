import {ContextCallable} from '@browndragon/callable';
import {Machine} from '@browndragon/sm';
import val from './val';

/**
 * Root of the A graph.
 */
export default class A extends Machine {
    constructor(cb) {
        super(cb);
    }
    /** a.dd a remark. */
    dd(...texts) {
        this.logged.push(...texts.map(val).filter(Boolean));
        return this;
    }
    /** a.sk a question (really, offer a single reply). */
    sk(label, cb) {
        // This was created under a specific nyway context.
        // If there's a call to nyway within this same node (inlines nest a new scope but don't otherwise damage it),
        // then we should take that same value.
        // 
        this.options.push([label, cb]);
        return this;
    }
    /** a.nyway a point to continue from when evaluating options. */
    // a.sk(...);
    // a.sk(...);
    // a.dd(...);  // Just logs as normal.
    // a.nyway(...); // Okay! the above a.sks need to redirect to here during their inlines if their state is no bueno.
    // a.sk(...);
    nyway(cb) {
        return this;
    }
    get nywayTop() { return this.nyways[this.nyways.length - 1] }
    display() {
        for (let i = 0; i < this.logged.length; ++i) {
            console.log('!', this.logged[i]);
        }
        for (let i = 0; i < this.options.length; ++i) {
            console.log('?', 'Option', i, this.options[i][0]);
        }
    }
    inline(next, ...params) {
        return super.inline(next, ...params);
    }
    next(...params) {
        if (this.value === undefined) {
            let index = +params[0];
            params = params.slice(1);
            console.assert(Number.isFinite(index));
            this.jump(this.options[index][1]);
        }

        this.logged = [];
        this.options = [];
        while(super.next(...params).value) {
            console.log('.', 'Intermediate nonterminal state -- starting over from:', this.value);
        }
        this.display();
        return this;
    }
}

