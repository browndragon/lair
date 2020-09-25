import { describe, test, expect } from '@jest/globals';
import Callable from './callable';

test('CallableExample', () => {
    class IncreaseBy extends Callable {
        constructor(x) {
            super((y) => this.x + y);
            this.x = x;
        }
    }
    let increasor = new IncreaseBy(1);
    expect(increasor(2)).toBe(3);
    increasor.x = 5;
    expect(increasor(3)).toBe(8);
})