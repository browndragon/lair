import { jest, test, expect } from '@jest/globals';
import SM from './sm';  // '@browndragon/sm'; <-- this is a unit test so I can't write that!

export const States = {
    on(sm) {sm.transition('off')},
    off(sm) {sm.transition('on')},
};

test('OnOffSimple', () => {
    let machine = new SM(States).reset('off');
    expect(machine.prev).toEqual('off');

    machine.step();
    expect(machine.prev).toEqual('on');
    machine.step();
    expect(machine.prev).toEqual('off');
});

test('OnOffOverridesBefore', () => {
    console.log = jest.fn();
    class LoggingSM extends SM {
        before() {
            console.log(`Transition into ${this.prev} -> ${this.next}`);
        }
    }
    let machine = new LoggingSM(States).reset('off');
    expect(console.log).toHaveBeenCalledWith('Transition into undefined -> off');
    machine.step();
    expect(console.log).toHaveBeenCalledWith('Transition into off -> on');
});

test('OnOffOverridesAfter', () => {
    console.log = jest.fn();
    class LoggingSM extends SM {
        after() {
            console.log(`Transition from ${this.prev} -> ${this.next}`);
        }
    }
    let machine = new LoggingSM(States).reset('off');
    expect(console.log).toHaveBeenCalledWith('Transition from off -> on');
    machine.step();
    expect(console.log).toHaveBeenCalledWith('Transition from on -> off');
});