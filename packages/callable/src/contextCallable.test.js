import { describe, test, expect } from '@jest/globals';
import ContextCallable from './contextCallable';

// Complex Function -- 
class CF extends ContextCallable {
    constructor() { 
        super((...params) => this.someCall(...params));
    }
    someCall(someArg) { return `(${this}, ${this.ctx}).someCall(${someArg})` }
    toString() { return `CF` }
}
const CTX = {
    toString() { return 'CTX' },
    implicitHere(someCallable, ...params) { return someCallable(...params) },
    callHere(someCallable, ...params) { return someCallable.call(this, ...params) },
    applyHere(someCallable, ...params) { return someCallable.apply(this, params) },
    bindHere(someCallable, ...params) { return someCallable.bind(this, ...params) },
};

// kinda weird, context free, o...k...
test('implicit', () => expect(CTX.implicitHere(new CF())).toEqual('(CF, undefined).someCall(undefined)'));
test('implicitArg', () => expect(CTX.implicitHere(new CF(), 'foo')).toEqual('(CF, undefined).someCall(foo)'));
test('2implicitArg', () => expect(CTX.implicitHere(new CF(), 'foo', 'bar')).toEqual('(CF, undefined).someCall(foo)'));

// Normal, sane, pleasant.
test('call', () => expect(CTX.callHere(new CF())).toEqual('(CF, CTX).someCall(undefined)'));
test('callArg', () => expect(CTX.callHere(new CF(), 'foo')).toEqual('(CF, CTX).someCall(foo)'))
test('2callArg', () => expect(CTX.callHere(new CF(), 'foo', 'bar')).toEqual('(CF, CTX).someCall(foo)'));;

test('apply', () => expect(CTX.applyHere(new CF())).toEqual('(CF, CTX).someCall(undefined)'));

// Exactly as if it were an arrow function.
test('bind', () => {
    let bound = CTX.bindHere(new CF());
    expect(typeof(bound)).toEqual('function');
    expect(bound).toBeInstanceOf(CF);
    expect(bound()).toEqual('(CF, CTX).someCall(undefined)');
});
