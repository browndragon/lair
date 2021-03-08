import { jest, test, expect } from '@jest/globals';
import Cursor from './cursor';  // '@browndragon/sm'; <-- this is a unit test so I can't write that!
import Machine from './machine';

describe('Inlines', () => {
    const Ts = {
        start() { this.runs = 0; return this.inline(Ts.running) },
        running(isShutdown) { this.runs++; return isShutdown ? this.inline(Ts.stopping) : Ts.running; },
        stopping() { this.runs = -this.runs; return undefined; }
    };

    test('Cursor', () => {
        let machine = new Cursor(Ts.start);
        expect(machine.value).toEqual(Ts.start);
        expect(machine.runs).toEqual(undefined);
        machine.next();
        expect(machine.value).toEqual(Ts.running);
        expect(machine.runs).toEqual(1);  // It was set to 0 in ctor and then ++ in the first run of running.
        machine.next()
        expect(machine.value).toEqual(Ts.running);
        expect(machine.runs).toEqual(2);  // It was set to 0 in ctor and then ++ in the first run of running.
        machine.next('shutdown');
        expect(machine.value).toEqual(undefined);
        expect(machine.runs).toEqual(-3);
    });

    test('MachineCounts', () => {
        let machine = new Machine(Ts.start);
        expect(machine.runs).toEqual(undefined);
        expect(machine.value).toEqual(Ts.start);
        expect(machine.getState(Ts.start)).toMatchObject({
            count:0, lastNext: undefined, lastInvoke: undefined,
        });
        expect(machine.getState(Ts.running)).toMatchObject({
            count:0, lastNext: undefined, lastInvoke: undefined,
        });

        machine.next();
        expect(machine.runs).toEqual(1);  // It was set to 0 in ctor and then ++ in the first run of running.
        expect(machine.value).toEqual(Ts.running);
        expect(machine.getState(Ts.start)).toMatchObject({
            count:1, lastNext: 1, lastInvoke: 1,
        });
        expect(machine.getState(Ts.running)).toMatchObject({
            count:1, lastNext: 1, lastInvoke: 2,
        });


        machine.next()
        expect(machine.runs).toEqual(2);  // It was set to 0 in ctor and then ++ in the first run of running.
        expect(machine.value).toEqual(Ts.running);
        expect(machine.getState(Ts.start)).toMatchObject({
            count:1, lastNext: 1, lastInvoke: 1,
        });
        expect(machine.getState(Ts.running)).toMatchObject({
            count:2, lastNext: 2, lastInvoke: 3,
        });


        machine.next('shutdown');
        expect(machine.value).toEqual(undefined);
        expect(machine.runs).toEqual(-3);

        expect(machine.getState(Ts.start)).toMatchObject({
            count:1, lastNext: 1, lastInvoke: 1,
        });
        expect(machine.getState(Ts.running)).toMatchObject({
            count:3, lastNext: 3, lastInvoke: 4,
        });
    });
});

test('SimpleHistory', () => {
    const X = {
        a() { return X.b },
        b() { return X.c },
        c() { },
    };
    let machine = new Machine(X.a);
    expect(machine.value).toEqual(X.a);
    expect(machine.here).toEqual(X.a);
    expect(machine.next().value).toEqual(X.b);
    expect(machine.here).toEqual(X.b);
    expect(machine.next().value).toEqual(X.c);
    expect(machine.here).toEqual(X.c);

    expect(machine.prevs).toEqual([X.a, X.b]);

    expect(machine.next().value).toEqual(undefined);
    expect(machine.prevs).toEqual([X.a, X.b, X.c]);
});

describe('Interrupts', () => {
    const Is = {
        start(x=1) { this.interrupts = 0; return this.inline(Is.running, x * 2) },
        running(x=1) { this.inline(Is.inline, x * 3) /*discard result*/; return Is.running },
        inline(x=1) { this.interrupts += (x || 0); return Is.inline; }
    };
    test('InterruptsHistory', () => {
        let machine = new Machine(Is.start);
        expect(machine.value).toEqual(Is.start);
        expect(machine.prevs).toEqual([]);
        expect(machine.getState(Is.start).count).toEqual(0);
        expect(machine.getState(Is.running).count).toEqual(0);
        expect(machine.getState(Is.inline).count).toEqual(0);

        machine.next(5);
        expect(machine.interrupts).toEqual(30);  // It was set to 0 in ctor and then ++ in the first run of running.
        expect(machine.value).toEqual(Is.running);
        expect(machine.prevs).toEqual([
            Is.start,
            Is.running,
            Is.inline,
        ]);
        expect(machine.getState(Is.start).count).toEqual(1);
        expect(machine.getState(Is.running).count).toEqual(1);
        expect(machine.getState(Is.inline).count).toEqual(1);


        machine.next(7)
        expect(machine.interrupts).toEqual(30 + 21);  // It was set to 0 in ctor and then ++ in the first run of running.
        expect(machine.value).toEqual(Is.running);
        expect(machine.prevs).toEqual([
            Is.start,
            Is.running,
            Is.inline,
            Is.running,
            Is.inline,
        ]);
        expect(machine.getState(Is.start).count).toEqual(1);
        expect(machine.getState(Is.running).count).toEqual(2);
        expect(machine.getState(Is.inline).count).toEqual(2);
    });
});

describe('Once', () => {
    // This is actually a better usecase of nests than of once. It's fine.
    const Os = {
        forever() {  return {
            a() { return Os.forever } 
        }.a  },
        once() { return this.once(() => ({
            a() { return Os.once },
        })).a },
    };
    test.each([
        ['forever', 5],
        ['once', 1]
    ])('%s has %s anonymized fs', (key, value) => {
        const seedState = Os[key];
        let m = new Machine(seedState);
        for (let i = 0; i < 10; ++i) { m.next() }
        expect(m.states.size).toEqual(value + 1);
        expect(m.getState(seedState).count).toEqual(5);
    });
});

describe('NestLegible', () => {
    function root() {
        return this.nest(() => {
            const X = {
                a() { return X.b },
                b() { return root },
            };
            return X;
        }).a
    };
    test('simple', () => {
        let m = new Machine(root);
        for (let i = 0; i < 10; ++i) { m.next() }
        expect(m.states.size).toEqual(3);        
        expect(m.getState(root).count).toEqual(4);
        expect(m.getState(m.getState(root).nest.a).count).toEqual(3);
        expect(m.getState(m.getState(root).nest.b).count).toEqual(3);
    });
    test('brokenNest', () => {
        let m = new Machine(root);
        m.nest = (cb) => cb();
        for (let i = 0; i < 10; ++i) { m.next() }
        expect(m.states.size).toEqual(8);
        expect(m.getState(root).count).toEqual(4);
        expect(m.getState(root).nest).toEqual(undefined);
    });
});

test('Goto', () => {
    let deadended = false;
    const X = {
        start() {
            this.trap(X.recover);
            return X.strand;
        },
        strand() { return X.deadend },
        deadend() { deadended = true },  // Returns undefined!
        recover() {},
    };
    let m = new Machine(X.start);
    expect(deadended).toBeFalsy();
    expect(m.next().value).toEqual(X.strand);
    expect(deadended).toBeFalsy();
    expect(m.next().value).toEqual(X.deadend);
    expect(deadended).toBeFalsy();
    expect(m.next().value).toEqual(X.recover);
    expect(deadended).toBeTruthy();
});

test('Goto Inline', () => {
    let deadended = false;
    const X = {
        start() { 
            this.trap(X.recover);
            return this.inline(X.strand);
        },
        strand() { return this.inline(X.deadend) },
        deadend() { deadended = true },
        recover() {},
    };
    let m = new Machine(X.start);
    expect(deadended).toBeFalsy();
    expect(m.next().value).toEqual(X.recover);
    expect(deadended).toBeTruthy();
});

test('Goto Cascade', () => {
    const X = {
        start() {
            this.trap(X.startRecover);
            return X.strand;
        },
        strand() {
            this.trap(X.strandRecover);
            return X.deadend;
        },
        deadend() {},
        strandRecover() {
            return X.strandHandle;
        },
        strandHandle() {},
        startRecover() {},
    };
    let m = new Machine(X.start);
    for (let state of [X.start, X.strand, X.deadend, X.strandRecover, X.strandHandle, X.startRecover]) {
        expect(m.value).toEqual(state);
        m.next();
    }
    expect(m.value).toEqual(undefined);
});

test('Goto Escape', () => {
    const Y = {
        overhere() {}
    };
    const X = {
        start() {
            this.trap(X.recover);
            return X.strand;
        },
        strand() { this.jump(Y.overhere) },
        recover() {}
    };
    let m = new Machine(X.start);
    for (let state of [X.start, X.strand, Y.overhere]) {
        expect(m.value).toEqual(state);
        m.next();
    }
    expect(m.value).toEqual(undefined);
});
