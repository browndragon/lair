import { test, expect } from '@jest/globals';
import Cursor from './cursor';
import Machine from './machine';  // '@browndragon/sm'; <-- this is a unit test so I can't write that!

// Implements triple phase of water WITHOUT sublimation/deposition, so that
// water goes through liquid on its way from solid to gas.
// There's intentionally hysteresis: water at 0 is a solid if it was a solid, liquid if it was a liquid.
export const Water = {
    solid(degC) { return degC > 0 ? Water.liquid : this.value },
    liquid(degC) { return degC > 100 ? Water.gas : degC < 0 ? Water.solid : this.value },
    gas(degC) { return degC < 100 ? Water.liquid : this.value },
};

test('SimpleWaterFlow', () => {
    let machine = new Cursor(Water.liquid);
    expect(machine.value).toEqual(Water.liquid);

    machine.next(0);
    expect(machine.value).toEqual(Water.liquid);
    machine.next(-1);
    expect(machine.value).toEqual(Water.solid);
    machine.next(0);
    expect(machine.value).toEqual(Water.solid);

    machine.next(101);
    expect(machine.value).toEqual(Water.liquid);

    machine.next(101);
    expect(machine.value).toEqual(Water.gas);
    machine.next(101);
    expect(machine.value).toEqual(Water.gas);
    machine.next(100);
    expect(machine.value).toEqual(Water.gas);
    machine.next(99);
    expect(machine.value).toEqual(Water.liquid);
    machine.next(100);
    expect(machine.value).toEqual(Water.liquid);
    machine.next(100);
    expect(machine.value).toEqual(Water.liquid);
    machine.next(101);
    expect(machine.value).toEqual(Water.gas);
});

test('SublimationByPre', () => {
    let machine = new Machine(Water.liquid);
    machine.next(101);
    expect(machine.value).toEqual(Water.gas);
    machine.next(-1);
    expect(machine.value).toEqual(Water.liquid);
    machine.next(-1);
    expect(machine.value).toEqual(Water.solid);

    // Insert a pre before every call that automatically makes the state phase based on temperature.
    // Note that this skips the proper phase: if it should have sublimated, this doesn't call solid at all, but merely
    // ensures the state execution of gas directly!
    machine.jump(Water.liquid);

    var log = [];
    machine.wrap = function wrapped(degC) {
        let state = (() => {
            // Patch in support for sublimation
            if (this.value == Water.solid && degC >= 100) { return Water.gas }
            if (this.value == Water.gas && degC <= 0) { return Water.solid }
            return this.value.call(this, degC);
        })();
        // Log it.
        log.push(`${this.value.name}-[${degC}]->${state.name}`);
        return state;
    };
    machine.next(101);
    expect(machine.value).toEqual(Water.gas);
    machine.next(-1);
    expect(machine.value).toEqual(Water.solid);
    machine.next(-1);
    expect(machine.value).toEqual(Water.solid);
    expect(log).toEqual(['liquid-[101]->gas', 'gas-[-1]->solid', 'solid-[-1]->solid']);

});
