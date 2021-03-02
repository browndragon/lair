import { jest, test, expect } from '@jest/globals';
import Callable from '@browndragon/callable';

describe('Language Tests', () => {
    console.assert = (statement, message) => {
      if (!statement) throw new Error(message);
    };
    test('Run decorators', () => {
        function annotate(prefix, module) {
            for (let [k, v] of Object.entries(module)) {
                v.annotated = `${prefix}.${k}`;
            }
            return module;
        }
        let X = annotate('prefix', {
            a() {
                return X.b.annotated;
            },
            b() {},
        });
        expect(X.a()).toEqual('prefix.b');
    });
    test('distinct closures', () => {
        function Outer() { 
            return function Inner() {};
        }
        expect(Outer()).not.toEqual(Outer());
        expect(Outer()).not.toBe(Outer());
    });
    test('hoisting rules', () => {
        let x = [() => x = [...x, ...x]];
        x[0]();
        expect(x.length).toEqual(2);
    });
    describe('keywords are okay as object keys', () => {
        let data = {
            if: 'if',
            else: 'else',
            default: 'default',
            finally: 'finally',
            case: 'case',
            select: 'select'
        };
        test.each(
            'if else case finally default select'.split(' '),    
        )('%s', (term) => expect(data[term]).toEqual(term));

        test('if', () => expect(data.if).toEqual('if'));
        test('else', () => expect(data.else).toEqual('else'));
        test('case', () => expect(data.case).toEqual('case'));
        test('finally', () => expect(data.finally).toEqual('finally'));
        test('select', () => expect(data.select).toEqual('select'));
    })
});
