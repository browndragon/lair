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
    let a = new A(()=>void(a.dd`Yes`));
    // Passed through the anonymous method without a trap set -> display, pass through display because nothing registered -> undefined.
    expect(a.next().value).toEqual(undefined);
    expect(a.describes).toEqual([]);
    expect(console.redirectedLogs).toEqual(['!Yes']);
});
test('log2deep', () => {
    let a = new A(()=>{
        a.dd`One`;
        return a.once(()=>()=>void(a.dd`Two`));
    });
    expect(a.next().value.name).toEqual("");
    // We haven't *run* the describe node yet, so we're still buffering output.
    expect(a.describes).toEqual(['One']);
    expect(console.redirectedLogs).toEqual([]);
    expect(a.next().value).toEqual(undefined);
    expect(a.describes).toEqual([]);
    expect(console.redirectedLogs).toEqual(['!One', '!Two']);
});
test('nocontinue', () => {
    let a = new A(()=>void(a.dd`Yes`));
    expect(a.next().value).toEqual(undefined);
    expect(console.redirectedLogs).toEqual(['!Yes']);
    expect(a.here).toEqual(undefined);
    expect(()=>a.next()).toThrow();
    // a.next();
    // expect(a.here).toEqual(undefined);
    // expect(console.redirectedLogs).toEqual(['!Yes', '!Yes']);
    // expect(a.here).toEqual(undefined);
    // a.next();
    // expect(a.here).toEqual(undefined);
    // expect(console.redirectedLogs).toEqual(['!Yes', '!Yes', '!Yes']);
    // // This test is broken. It *should* log once and then go to a select with no options, but it doesn't seem to...
    // expect(false).toBeTruthy();
});
test('proffer', () => {
    let a = new A(() => {
        a.sk`this?`();
        a.sk`that?`();
    });
    expect(a.next().value).toEqual(a.select);
    expect(a.options).toEqual([['this?', undefined], ['that?', undefined]]);
    expect(console.redirectedLogs).toEqual(['?Option0this?', '?Option1that?', ]);
});
test('profferReuse', () => {
    let a = new A(() => {
        a.sk`this?`()
            `that?`();
    });
    expect(a.next().value).toEqual(a.select);
    expect(a.options).toEqual([['this?', undefined], ['that?', undefined]]);
    expect(console.redirectedLogs).toEqual(['?Option0this?', '?Option1that?', ]);
});

test('profferBadReuse', () => {
    let a = new A(() => {
        a.sk`unterminated`  // Oops, forgot to list the consequences of this choice!
            `terminated`();
    });
    expect(a.next().value).toEqual(a.select);
    expect(a.options).toEqual([['unterminated', undefined], ['terminated', undefined]]);
    expect(console.redirectedLogs).toEqual(['?Option0unterminated', '?Option1terminated', ]);
});
describe('select', () => {
    const choices = ['Good', 'Okayish']
    function thisOrThat() {
        let a = this;
        a.dd`Hello!`;
        a.sk`this?`(()=>void(a.describe(choices[0])))
            `that?`(()=>void(a.describe(choices[1])));
    }
    test.each([0, 1])('%#', (opt) => {
        let a = new A(thisOrThat);
        expect(a.next().value).toEqual(a.select);
        expect(a.describes).toEqual([]);
        expect(a.options.length).toEqual(2);
        expect(a.options[0][0]).toEqual('this?');
        expect(a.options[1][0]).toEqual('that?');
        expect(console.redirectedLogs).toEqual(['!Hello!', '?Option0this?', '?Option1that?']);

        expect(a.next(opt).value).toEqual(undefined);
        expect(a.describes).toEqual([]);
        expect(a.options).toEqual([]);

        expect(console.redirectedLogs).toEqual(['!Hello!', '?Option0this?', '?Option1that?', `!${choices[opt]}`]);

        expect(()=>a.next()).toThrow();
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
//     expect(a.describes).toEqual(['begin', 'end']);
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
