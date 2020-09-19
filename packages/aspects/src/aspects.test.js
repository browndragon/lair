import { describe, test, expect } from '@jest/globals';
import Aspect from './aspect';
import Registry from './registry';

class Count extends Aspect {
    constructor(...params) {
        super(...params);
        this.count = 0;
    }
    bind(instance, data) {
        return super.bind(instance, {...data, count: this.count++});
    }
}

class Nil extends Aspect {
    bind(instance) {
        return super.bind(instance, NilObject);
    }
}
const NilObject = Symbol();

class StoreSelf extends Aspect {
    bind(instance, data=instance) {
        return super.bind(instance, data);
    }
}

class RejectConsonants extends Aspect {
    bind(instance, data=instance) {
        let ret = `${data}`.replace(/[bcdfghjklmnpqrstvwxz]/gi, '');
        return super.bind(instance, ret == '' ? undefined : ret);
    }
}

function instances(registry, Aspect) {
    let instances = {};
    registry.aspect(Aspect).forEach((instance, data) => {
        instances[instance] = data;
    });
    return instances;
}

describe('nil', () => {
    let r = new Registry();
    r.register(Nil);
    const data = () => instances(r, Nil);
    // Use describes so that they run in order -- they're dependent on previous setup.
    describe('aspect getter', () => {
        expect(r.aspect(Nil)).toBeInstanceOf(Nil);
        expect(r.aspect(Nil).forEach).toBeTruthy();
    });
    describe('empty', () => {
        expect(data()).toEqual({});
    });
    describe('a b', () => {
        r.aspect(Nil).bind('a');
        r.aspect(Nil).bind('b', 17);
        expect(data()).toEqual({ a: NilObject, b: NilObject });
    });
    describe('unbind c', () => {
        r.aspect(Nil).unbind('c');  // No such element.
        expect(data()).toEqual({ a: NilObject, b: NilObject });
    });
    describe('unbind a', () => {
        r.aspect(Nil).unbind('a');
        expect(data()).toEqual({ b: NilObject });
    });
});

describe('multipleAspects', () => {
    test('storage', () => {
        let r = new Registry();
        r.register(StoreSelf);
        r.register(Count);
        let calls = [];
        r.forEach((aspect) => calls.push(aspect));
        expect(calls.length).toEqual(2);
        const [storeCall, countCall] = calls;
        expect(storeCall).toBeInstanceOf(StoreSelf);
        expect(countCall).toBeInstanceOf(Count);
    });
    describe('one element', () => {
        let r = new Registry();
        const data = (Aspect) => instances(r, Aspect);
        r.register(StoreSelf);
        r.register(Count);
        describe('add a', () => {
            r.aspect(StoreSelf).bind('a');
            r.aspect(Count).bind('a');
            expect(data(StoreSelf)).toEqual({a: 'a'});
            expect(data(Count)).toEqual({a: {count:0}});            
        });
        describe('remove Count a', () => {
            r.aspect(Count).unbind('a');
            expect(data(StoreSelf)).toEqual({a: 'a'});
            expect(data(Count)).toEqual({});
        });
        describe('(re-)add Count a', () => {
            r.aspect(Count).bind('a');
            expect(data(StoreSelf)).toEqual({a: 'a'});
            expect(data(Count)).toEqual({a: {count:1}});
        });
    });
    describe('multiple elements', () => {
        let r = new Registry();
        const data = (Aspect) => instances(r, Aspect);
        r.register(StoreSelf);
        r.register(Count);
        r.register(RejectConsonants);
        const str = 'abcdefg';
        for (let elem of str) {
            r.forEach(aspect => aspect.bind(elem));
        }
        test.each([
            [StoreSelf, Object.fromEntries(Array.from(str).map(x => [x, x]))],
            [Count, Object.fromEntries(Array.from(str).map((x, i) => [x, {count:i}]))],
            [RejectConsonants, {a:'a', e:'e'}],
        ])('%p', (Aspect, entries) => {
            expect(instances(r, Aspect)).toEqual(entries);
        });
    });

});
