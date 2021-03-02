import Machine from './machine';
import Line from './line';
import Option from './option';
import Flag from './flag';

/**
 * A state machine with additional functionality based somewhat on
 * https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md
 * (albeit in pure JS).
 *
 * The main features that require "javascript emulation" are easily nested options
 * (which otherwise are somewhat heavyweight), logging, etc. Markdown is not given
 * special support here, since that's a display-layer problem.
 *
 * In general, this deals with the nodes you provide it + several inlined "synthetic" nodes, which are used to handle input etc.
 * Its quiescent state is determined as soon as you feed it input.
 */
export default class Ink extends Machine {
    constructor(value) {
        super(value);

        this.options = new Factory(Option);
        this.lines = new Factory(Line);

        this.waitingForChoice = false;
        this.comeFrom = undefined;
    }

    get o() { return this.options.start() }
    get l() { return this.lines.start() }

    get done() { return this.waitingForChoice || super.done; }

    run() {
        for (let _ of this) {}
        return this;
    }

    /** Executes & returns a state -- like, function-pointer-return-from-state state -- which implements the current choice horizon. This is sufficent to let you zoom through states in a for loop. */
    choices(...choices) {
        // The last choice is special: it gets the chance to be a function. In fact, if it *isn't* a function, we should fake it up:
        // it's the choice of last resort for *all* of the functions given! And probably should be the choice of last resort for each of their children as well!
        // Luckily, this is really easy because it lives "on the stack" -- we can set it and clear it here.
        let comefrom = choices[choices.length - 1];
        if (typeof(comefrom) == 'function') {
            choices.pop();

        }
        this.offer(choices);
        return this.inline(function _choiceNode(number) {
            if (number != undefined) {
                const [_, d, v] = this.options[+number];
                this.options.clear();
                this.waitingForChoice = false;
                this.log(d);
                return this.inline(v);
            }
            this.waitingForChoice = true;
            return _choiceNode;
        });
    }
}