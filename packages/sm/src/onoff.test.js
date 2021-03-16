import { jest, test, expect } from '@jest/globals';
import Cursor from './cursor';  // '@browndragon/sm'; <-- this is a unit test so I can't write that!
import Machine from './machine';

export const States = {
    off() { return States.on },
    on() { return States.off },
};

test('OnOffCursor', () => {
    let machine = new Cursor(States.on);
    expect(machine.value).toEqual(States.on);

    machine.next();
    expect(machine.value).toEqual(States.off);

    machine.next();
    expect(machine.value).toEqual(States.on);

    machine.next();
    expect(machine.value).toEqual(States.off);
});

test('OnOffEnterExit', () => {
    let machine = new Machine(States.off);
    let log = [];
    machine.wrap = jest.fn(function(...params) {
        log.push('before', this.prev, this.value);
        let state = this.value.apply(this, params);
        log.push('after', this.value, state);
        return state;
    });

    machine.next();
    expect(machine.wrap).toHaveBeenCalledWith();
    expect(log).toEqual([
        'before', undefined, States.off,
        'after', States.off, States.on,
    ]);
    expect(machine.value).toEqual(States.on);
});

test('OnOffExitRedirect', () => {
    let machine = new Machine(States.off);
    // Jam whenever we attempt to transition.
    machine.stuckCount = 0;
    machine.wrap = jest.fn(function wrapped(...params) {
        this.stuckCount++;
        return States.off;
    });

    machine.next();
    expect(machine.wrap).toHaveBeenCalledWith();
    expect(machine.stuckCount).toEqual(1);
    expect(machine.value).toEqual(States.off);
});
