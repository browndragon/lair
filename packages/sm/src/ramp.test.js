import { jest, test, expect } from '@jest/globals';
import SM from './sm';  // '@browndragon/sm'; <-- this is a unit test so I can't write that!

const States = {
    ramp(sm, dir) {
        console.log(`Powering ${dir}`);
        return sm.transition(dir, true);
    },
    on(sm, ramped) {
        if (ramped) {
            console.log('on');
            return false;
        }
        return sm.transition('ramp', 'off');
    },
    off(sm, ramped) {
        if (ramped) {
            console.log('off');
            return false;
        }
        return sm.transition('ramp', 'on');
    }
};

test('Ramp', () => {
    console.log = jest.fn();
    let machine = new SM(States).reset('off', true);
    machine.step();
    expect(machine.prev).toEqual('on');
    machine.step();
    expect(machine.prev).toEqual('off');
    machine.step();
    expect(machine.prev).toEqual('on');

    expect(console.log).toHaveBeenCalledTimes(7);
    expect(console.log).toHaveBeenNthCalledWith(1, 'off');
    expect(console.log).toHaveBeenNthCalledWith(2, 'Powering on');
    expect(console.log).toHaveBeenNthCalledWith(3, 'on');
    expect(console.log).toHaveBeenNthCalledWith(4, 'Powering off');
    expect(console.log).toHaveBeenNthCalledWith(5, 'off');
    expect(console.log).toHaveBeenNthCalledWith(6, 'Powering on');
    expect(console.log).toHaveBeenNthCalledWith(7, 'on');
});

