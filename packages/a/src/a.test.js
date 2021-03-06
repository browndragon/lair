import { jest, test, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import A from './a';

let oldValues = {};
beforeAll(() => {
    oldValues.log = console.log;
    oldValues.assert = console.assert;
})
afterAll(() => {
    console.log = oldValues.log;
    console.assert = oldValues.assert;
});
beforeEach(() => {
    console.redirectedLogs = [];
    console.log = (...params) => void(console.redirectedLogs.push(params.join('')));
    console.assert = (statement, message) => {
        if (!statement) throw new Error(message);
    };
});

test('log', () => {
    let a = new A(()=>void(a.dd('Yes')));
    expect(a.next().value).toEqual(undefined);
    expect(a.logged).toEqual(['Yes']);
    expect(console.redirectedLogs).toEqual(['!Yes']);
});
test('log2deep', () => {
    let a = new A(()=>{
        a.dd('One');
        return a.nest(()=>()=>void(a.dd('Two')));
    });
    expect(a.next().value).toEqual(undefined);
    expect(a.logged).toEqual(['One', 'Two']);
    expect(console.redirectedLogs).toEqual([
        expect.stringMatching(/\.Intermediate nonterminal state -- starting over from:.*/), '!One', '!Two'
    ]);
});
test('nocontinue', () => {
    let a = new A(()=>void(a.dd('Yes')));
    a.next();
    expect(console.redirectedLogs).toEqual(['!Yes']);
    expect(()=>a.next()).toThrow();
});
test('proffer', () => {
    let a = new A(() => {
        a.sk('this?');
        a.sk('that?');
    });
    expect(a.next().value).toEqual(undefined);
    expect(a.options).toEqual([['this?', undefined], ['that?', undefined]]);
    expect(console.redirectedLogs).toEqual(['?Option0this?', '?Option1that?', ]);
});
describe('select', () => {
    const choices = ['Good', 'Bad']
    function thisOrThat() {
        let a = this;
        a.sk('this?', ()=>void(a.dd(choices[0])));
        a.sk('that?', ()=>void(a.dd(choices[1])));
    }
    test.each([[0], [1]])('%# %i', (opt) => {
        let a = new A(thisOrThat);
        expect(a.next().value).toEqual(undefined);
        expect(a.options.length).toBeGreaterThan(opt);

        expect(a.next(opt).value).toEqual(undefined);
        expect(a.logged).toEqual([choices[opt]]);
        expect(a.options).toEqual([]);
        expect(console.redirectedLogs).toEqual(['?Option0this?', '?Option1that?', `!${choices[opt]}`]);
    });
});
// test('fallbackOnly', () => {
//     let a = new A(() => {
//         a.dd('begin');
//         // No a.sk at all;
//         a.nyway(() => {
//             a.dd('end');
//         });
//     });
//     expect(a.next().value).toEqual(undefined);
//     expect(a.logged).toEqual(['begin', 'end']);
//     expect(a.options).toEqual([]);
// });
// describe('fallbackAway', () => {
//     const fs = {
//         [0](){ this.sk('again') },
//         [1](){ this.sk('again', fs[0]) },
//         [2](){ this.sk('again', fs[1]) },
//     };
//     for (let i = 0; i < 3; ++i) {
//         const j = i;
//         test(`From depth ${j}`, () => {
//             let a = new A(() => {
//                 a.inline(fs[0]);
//                 a.nyway(()=> void(a.dd('over')));   
//             });
//             let expectedLogs = [];
//             for (let i = 0; i < j; ++i) {
//                 expect(a.next().value).toEqual(undefined);
//                 expect(a.options.length).toEqual(1);
//                 expectedLogs.push('?Option0again');
//             }
//             expect(a.next().value).toEqual(undefined);
//             expect(a.options.length).toEqual(0);
//             expectedLogs.push('?Option0again');
//             expectedLogs.push('!over');

//             expect(console.redirectedLogs).toEqual(expectedLogs);
//         });
//     }
// });
