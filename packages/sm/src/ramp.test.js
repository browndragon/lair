import { jest, test, expect } from '@jest/globals';
import Cursor from './cursor';  // '@browndragon/sm'; <-- this is a unit test so I can't write that!

const States = {
    ramp() {
        this.power += this.increment;
        if (this.power >= 3) { return States.on }
        if (this.power <= 0) { return States.off }
        return this.value;
    },
    on() {
        this.increment = -1;
        return States.ramp;
    },
    off() {
        this.power = 0;
        this.increment = +1;
        return States.ramp;
    }
};

test('Ramp', () => {
    let machine = new Cursor(States.off);

    expect(machine.value).toEqual(States.off);
    machine.next();
    expect(machine.value).toEqual(States.ramp);
    machine.next();
    expect(machine.value).toEqual(States.ramp);
    machine.next();
    expect(machine.value).toEqual(States.ramp);
    machine.next();
    expect(machine.value).toEqual(States.on);
    machine.next();
    expect(machine.value).toEqual(States.ramp);
    machine.next();
    expect(machine.value).toEqual(States.ramp);
    machine.next();
    expect(machine.value).toEqual(States.ramp);
    machine.next();
    expect(machine.value).toEqual(States.off);
});

