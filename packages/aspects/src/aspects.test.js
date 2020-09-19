import { describe, test, expect } from '@jest/globals';
import Aspect from './aspect';
import Registry from './registry';

class Count extends Aspect {
    constructor(...params) {
        super(...params);
        this.count = 0;
    }
    bound(instance, data) {
        return {...data, count: count++};
    }
}

class Nil extends Aspect {
    bound(instance, data) {
        return NilObject;
    }
}
const NilObject = Symbol();

class StoreSelf extends Aspect {
    bound(instance) {
        return instance;
    }
}

class RejectConsonants extends StoreSelf {
    bound(instance) {
        let ret = super.bound(instance).replace(/[bcdfghjklmnpqrstvwxyz]/gi, '');
        if (ret == '') {
            return undefined;
        }
        return ret;
    }
}

function instances(registry, Aspect) {
    let instances = {};
    registry._aspect(Aspect).forEach((aspect, instance, data) => {
        const [aspect, instance, data] = params;
        instances[instance] = data;
        calls.push(instance);
        expect(aspect).toBeInstanceOf(Aspect);
    });
    return instances;
}

describe('nil', () => {
    let r = new Registry();
    r.register(Nil);
    const data = () => instances(r, Nil);
    // Use describes so that they run in order -- they're dependent on previous setup.
    describe('_aspect', () => {
        expect(r._aspect(Nil)).toBeInstanceOf(Nil);
        expect(r._aspect(Nil).forEach).toBeTruthy();
    });
    describe('empty', () => {
        expect(data()).toEqual({});
    });
    describe('a b', () => {
        r.bind(Nil, 'a');
        r.bind(Nil, 'b', 17);
        expect(data()).toEqual({ a: NilObject, b: NilObject });
    });
    describe('unbind c', () => {
        r.unbind(Nil, 'c');  // No such element.
        expect(data()).toEqual({ a: NilObject, b: NilObject });
    });
    describe('unbind a', () => {
        r.unbind(Nil, 'a');
        expect(data()).toEqual({ b: NilObject });
    });
});

describe('multipleAspects', () => {
    test('storage', () => {
        let r = new Registry();
        r.register(StoreSelf);
        r.register(Count);
        let calls = [];
        r.forEachAspect((aspect) => calls.push(aspect));
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
            r.bind(StoreName, 'a');
            r.bind(Count, 'a');
            expect(data(StoreName)).toEqual({a: 'a'});
            expect(data(Count)).toEqual({a: {count:0}});            
        });
        describe('remove Count a', () => {
            r.unbind(Count, 'a');
            expect(data(StoreName)).toEqual({a: 'a'});
            expect(data(Count)).toEqual({});
        });
        describe('(re-)add Count a', () => {
            r.bind(Count, 'a');
            expect(data(StoreName)).toEqual({a: 'a'});
            expect(data(Count)).toEqual({a: {count:1}});
        });
    });
    describe('multiple elements', () => {
        let r = new Registry();
        const data = (Aspect) => instances(r, Aspect);
        r.register(StoreSelf);
        r.register(Count);
        r.register(RejectConsonants);
        describe('add a', () => {
            r.bind(StoreName, 'a');
            r.bind(Count, 'a');
            expect(data(StoreName)).toEqual({a: 'a'});
            expect(data(Count)).toEqual({a: {count:0}});            
        });
        describe('remove Count a', () => {
            r.unbind(Count, 'a');
            expect(data(StoreName)).toEqual({a: 'a'});
            expect(data(Count)).toEqual({});
        });
        describe('(re-)add Count a', () => {
            r.bind(Count, 'a');
            expect(data(StoreName)).toEqual({a: 'a'});
            expect(data(Count)).toEqual({a: {count:1}});
        });
    });

});
