import { describe, test, expect } from '@jest/globals';
import SM from './sm';  // '@browndragon/sm'; <-- this is a unit test so I can't write that!

test('SozuFlow', () => {
    const SozuState = {  // https://en.wikipedia.org/wiki/Shishi-odoshi
        fullness: 0,
        capacity: 100,
        filling(sm, amount) {
            expect(Number.isFinite(amount)).toBeTruthy();
            this.fullness += amount;
            if (this.fullness >= this.capacity) {
                return sm.transition('dumping');
            }
        },
        dumping(sm) {
            this.fullness = 0;
            return sm.transition('filling', 0);
        },
        toString() { return `${this.fullness}/${this.capacity}` }
    };
    let machine = new SM(SozuState).reset('filling', 0);
    expect(machine.next).toEqual('filling');

    machine.step(50);
    expect(machine.prev).toEqual('filling');
    expect(SozuState.fullness).toEqual(50);

    machine.step(49);
    expect(machine.prev).toEqual('filling');
    expect(SozuState.fullness).toEqual(99);

    // Trigger overflow!
    machine.step(2);
    expect(machine.prev).toEqual('filling');
    expect(SozuState.fullness).toEqual(0);

    machine.step(10);
    expect(machine.prev).toEqual('filling');
    expect(SozuState.fullness).toEqual(10);
});

