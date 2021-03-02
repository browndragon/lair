import { test, expect } from '@jest/globals';
import Cursor from './cursor';  // '@browndragon/sm'; <-- this is a unit test so I can't write that!

test('SozuFlow', () => {
    const SozuState = {  // https://en.wikipedia.org/wiki/Shishi-odoshi
        dumping() {
            // This doesn't NEED to be implemented here, but it's a reasonable place to go.
            this.capacity = 100;
            this.fullness = 0;
            return this.inline(SozuState.filling);
        },
        filling(amount=0) {
            this.fullness += amount;
            return this.fullness >= this.capacity ? this.inline(SozuState.dumping) : this.value;
        },
    };
    let machine = new Cursor(SozuState.dumping);
    expect(machine.value).toEqual(SozuState.dumping);
    expect(machine.fullness).toEqual(undefined);

    machine.next();
    expect(machine.value).toEqual(SozuState.filling);
    expect(machine.fullness).toEqual(0);

    machine.next(50);
    expect(machine.value).toEqual(SozuState.filling);
    expect(machine.fullness).toEqual(50);

    machine.next(49);
    expect(machine.value).toEqual(SozuState.filling);
    expect(machine.fullness).toEqual(99);

    // Trigger overflow!
    machine.next(2);
    expect(machine.value).toEqual(SozuState.filling);
    expect(machine.fullness).toEqual(0);

    // The water that attempted to fill us while we were dumping is discarded.
    machine.next(10);
    expect(machine.value).toEqual(SozuState.filling);
    expect(machine.fullness).toEqual(10);

    machine.next(15);
    expect(machine.value).toEqual(SozuState.filling);
    // The water that attempted to fill us while we were dumping is discarded.
    expect(machine.fullness).toEqual(25);
});

