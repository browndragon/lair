import { jest, test, expect } from '@jest/globals';
import Option from './option';

describe('Option Tests', () => {
    console.assert = (statement, message) => {
      if (!statement) throw new Error(message);
    };
    test('One', () => {
        expect(Option.tag`Go north`('north')).toEqual({
            head: `Go north`,
            body: `Go north`,
            next: 'north',
        });    
    });
    test('Two', () => {
        expect(Option.tag`North``. That was the way to go.`('N')).toEqual({
            head: `North`,
            body: `North. That was the way to go.`,
            next: 'N',
        });
    });
    test('Three', () => {
        expect(Option.tag`'Really``.'``,' I deadpanned.`(17)).toEqual({
            head: `'Really.'`,
            body: `'Really,' I deadpanned.`,
            next: 17,
        });
    });
    test('ThreeNoPrefix', () => {
        expect(Option.tag```North``Go north`('NN')).toEqual({
            head: `North`,
            body: `Go north`,
            next: 'NN',
        });    
    });
    test('NonStringNext', () => {
        function lambda() {}
        expect(lambda.done).toBe(undefined);
        expect(Option.tag`Proof`(lambda)).toEqual({
            head: 'Proof',
            body: 'Proof',
            next: lambda,
        });
        expect(lambda.done).toBe(undefined);
    });
    // test('Callbacks', () => {
    //     function lambda() {}
    //     expect(lambda.done).toBe(undefined);
    //     let o = new Option((t) => lambda.done = t);
    //     expect(o`Proof`(lambda)).toEqual({
    //         head: 'Proof',
    //         body: 'Proof',
    //         next: lambda,
    //     });
    //     expect(lambda.done).toBe(o);
    // })
});
