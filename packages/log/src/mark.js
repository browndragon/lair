import Tagger from '@browndragon/tag';

/**
 * Provides utilities for labeling modules, functions, and arbitrary lines.
 * The state machine *should* provide a default Mark for every named function.
 */
export default class Mark {
    // Names all *top level* functions in a module as coming from that module.
    // The most sensible way to use this (IMO) is in your `index.js` file, where when you must export your module entries, you simply `import a from './a'; import b from './b'; export default Mark.Module('thisModule', {a, b})`.
    Module(prefix, module) {
        for (let [k, v] of Object.entries(module)) {
            if (v.mark) { console.warn(`${k} is already marked ${v.mark}!`); continue; }
            v.mark = `$${prefix}.${k}`;
        }
        return module;
    }
    // Marks a function with the last-seen *good* mark as its prefix.
    // This can be a little misleading, as in the case when multiple paths can reach the same mark.
    Function(f, lastKnown) {
        if (f.mark) { return f.mark }
        return f.mark = `?${lastKnown || ''}>${this.name(f)}`
    }
    // Marks a specific line. Usually this can't be 
    Label(label, parent) {
        return return 
    }
 

    markFunction(f) {
        if (f.mark) { return f.mark }
        if (f.name) { return f.mark = `?${this.value.mark}>${f.name}` }
    }

}
