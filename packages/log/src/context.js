// // Is any of this needed? I imagine this as something inside of cursor which can be used to push default values around: like, name of method (for history tracking/checking if states were entered), and for sticking contextual information onto (like: who delivered the last line for the next line, or accumulating parts of an option so we can detect accidentally broken chains).
// // But! This might not want to live here at all; if as-i-suspect we need to explicitly pass a lot of this stuff around, then this is the wrong metaphor for it. For instance, if we need to track lines, then the line builder just needs to track lines, and if we want to hit breakpoints, we're better off using a combination of `this.value` and raw strings than this fakey-restorey mechanism.
// const Names = {
//     i: 1,
//     seen: new WeakMap(),
//     of(f) {
//         switch (typeof(f)) {
//             case 'undefined': return 'undefined';
//             case 'string': return f;
//             case 'function': return this.pseudonym(f);
//             default: throw `unrecognized ${f}`;
//         }
//     },
//     pseudonym(f) {
//         let seen = this.seen.get(f);
//         if (!seen) { this.seen.set(f, seen = this.i++) }
//         return `anon[${seen}]`;
//     },
//     clear() {
//         this.i = 1;
//         this.seen = new WeakMap();
//     },
// };
// const SYM = Symbol('Context');
// export default class Context {
//     static of(parentOrName, name) {
//         if (!name) {
//             name = parentOrName;
//             parentOrName = undefined;
//         }
//         return new Context(Names.of(name), parentOrName);
//     }
//     static ualize(clazz) {
//         const CClass = this;
//         return class ualized extends clazz {
//             context(parentOrName, name) {
//                 if (!parentOrName && !name) {
//                     return this[SYM];
//                 }
//                 return this[SYM] = CClass.of(parentOrName, name);
//             }
//         };
//     }

//     constructor(name, parent) {
//         this.name = name;
//         this.fullname = parent ? `$${parent.fullname}.${name}` : `$${name}`;
//         this.parent = parent || this;
//         this.restore();
//     }

//     get(k) { return this.data[k] }
//     set(k, v) { this.swap(k, v); return this; }
//     delete(k) { delete this.data[k] }
//     swap(k, v) { let oldV = this.data[k]; this.data[k] = v; return oldV; }
//     inc(k, v=1) { this.set(k, (this.get(k) || 0) + 1); return this; }
//     restore() { this.data = Object.assign({}, (this.parent && this.parent.data) || {}); return this; }
//     clear() { this.data = {} }
// };
