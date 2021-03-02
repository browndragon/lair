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

    test('MachineHistory', () => {
        let machine = new Machine(Ts.start);
        expect(machine.runs).toEqual(undefined);
        expect(machine.value).toEqual(Ts.start);
        expect(machine.prevs).toEqual([
        ]);

        machine.next();
        expect(machine.runs).toEqual(1);  // It was set to 0 in ctor and then ++ in the first run of running.
        expect(machine.value).toEqual(Ts.running);
        expect(machine.prevs).toEqual([
            Ts.start,
            Ts.running,
        ]);


        machine.next()
        expect(machine.runs).toEqual(2);  // It was set to 0 in ctor and then ++ in the first run of running.
        expect(machine.value).toEqual(Ts.running);
        expect(machine.prevs).toEqual([
            Ts.start,
            Ts.running,

            Ts.running,
        ]);


        machine.next('shutdown');
        expect(machine.value).toEqual(undefined);
        expect(machine.runs).toEqual(-3);

        expect(machine.prevs).toEqual([
            Ts.start,
            Ts.running,

            Ts.running,

            Ts.running,
            Ts.stopping,
        ]);
    });
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
        expect(machine.prevs).toEqual([
        ]);

        machine.next(5);
        expect(machine.interrupts).toEqual(30);  // It was set to 0 in ctor and then ++ in the first run of running.
        expect(machine.value).toEqual(Is.running);
        expect(machine.prevs).toEqual([
            Is.start,
            Is.running,
            Is.inline,
        ]);


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
    });
});

describe('Resumes', () => {
    test('ResumesHistory', () => {
        const Ss = {
            start() {
                if (this.chosen) { return this.chosen }
                this.trap();
                return Ss.choose;
            },
            choose(s) { this.chosen = s },
            a() {},
            b() {},
        };
        let machine = new Machine(Ss.start);
        machine.next();
        machine.next(Ss.a);
        machine.next();
        machine.next();
        expect(machine.value).toEqual(undefined);
        expect(machine.prevs).toEqual([
            Ss.start,
            Ss.choose,
            Ss.start,
            Ss.a,
        ]);
    });
    test('Traps', () => {
        const Ss = {
            a() {this.trap(0, Ss.b); return Ss.c;},
            b() {return Ss.c},
            c() {return Ss.d},
            d() {}
        };
        let machine = new Machine(Ss.a);
        machine.next();
        expect(machine.value).toEqual(Ss.c);
        machine.next();
        expect(machine.value).toEqual(Ss.d);
        machine.next();
        expect(machine.value).toEqual(Ss.b);
        machine.next();
        expect(machine.value).toEqual(Ss.c);
        machine.next();
        expect(machine.value).toEqual(Ss.d);
        machine.next();
        expect(machine.value).toEqual(undefined);
    });
});
