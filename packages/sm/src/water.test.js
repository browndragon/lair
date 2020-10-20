import { test, expect } from '@jest/globals';
import SM from './sm';  // '@browndragon/sm'; <-- this is a unit test so I can't write that!

// Implements triple phase of water WITHOUT sublimation/deposition, so that
// water goes through liquid on its way from solid to gas.
export const Water = {
    solid(sm, degC) {
        if (degC > 0) { return sm.transition('liquid', degC) }
        return false;
    },
    liquid(sm, degC) {
        if (degC > 100) { return sm.transition('gas', degC) }
        if (degC < 0) { return sm.transition('solid', degC) }
        return false;
    },
    gas(sm, degC) {
        if (degC < 100) { return sm.transition('liquid', degC) }
        return false;
    },
};
class PhaseWatcher extends SM {
    constructor(object) {
        super(object);
        this.phases = [];
    }
    before() {
        this.phases.push(this.next);
    }
}

test('SimpleWaterFlow', () => {
    let machine = new SM(Water).reset('liquid', 50);

    expect(machine.prev).toEqual('liquid');
    machine.step(50);
    expect(machine.prev).toEqual('liquid');
    machine.step(-1);
    expect(machine.prev).toEqual('solid');
    machine.step(101);
    expect(machine.prev).toEqual('gas');
    machine.step(50);
    expect(machine.prev).toEqual('liquid');
});

test('WaterFlowProveStates', () => {
    let machine = new PhaseWatcher(Water).reset('liquid').step(50);
    machine.step(50);
    machine.step(50);
    expect(machine.phases).toEqual(['liquid']);
    machine.phases.splice(0, machine.phases.length);
    machine.step(-1);
    machine.step(101);
    expect(machine.phases).toEqual(['solid', 'liquid', 'gas']);
});

test('Sublimation', () => {
    // Bad practice, this should just live in your states. Still, shows the principle that you might want to redirect some or all state transitions, such as for errors or similar.
    class Sublimer extends PhaseWatcher {
        before() {
            let [degC, ...rest] = this.params;
            if (degC < 0 && this.prev == 'gas') {
                this.transition('solid', degC);
            }
            if (degC > 100 && this.prev == 'solid') {
                this.transition('gas', degC);
            }
            super.before([degC, ...rest]);
        }
    }
    let machine = new Sublimer(Water).reset('liquid').step(50);

    machine.step(50);
    machine.step(50);
    expect(machine.phases).toEqual(['liquid']);
    machine.phases.splice(0, machine.phases.length);
    machine.step(-1);
    machine.step(101);
    expect(machine.phases).toEqual(['solid', 'gas']);
});