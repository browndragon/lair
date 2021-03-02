import { jest, test, expect } from '@jest/globals';
import Cursor from './cursor';  // '@browndragon/sm'; <-- this is a unit test so I can't write that!

function init() { this.food = 0; this.hungry = 0; this.sleepy = 0; this.happy = 1; }
function decide() { return this.hungry > 0 ? tryEat : this.sleepy ? doSleep : worry }
function tryEat() { return this.food > 0 ? doEat : doHunt }
function doEat() { this.food--; this.hungry--; this.happy++; console.log('Grog eat food!') }
function doHunt() { this.food++; this.sleepy++; this.happy++; console.log('Grog spend day hunting!') }
function doSleep() { this.sleepy--; this.happy++ ; console.log('Grog enjoy nap.') }
function worry() { this.sleepy++; this.hungry++; this.happy-=2; console.log('Grog troubled.') }


function grogAdventure() {
    let m = new Cursor(init);
    m.next();
    console.log('You are a neanderthal for ten days.');
    for (let i = 1; i <= 10; ++i) {
        console.log(`Dawn of the ${nth(i)} day`);
        m.jump(decide);
        for (let _ of m) {}
        const {food, hungry, sleepy, happy} = m;
        console.log('Grog is: ', {hungry, sleepy, happy}, 'Grog has: ', {food});
    }
    function nth(n) { return n == 1 ? `1st` : n == 2 ? `2nd` : n == 3 ? `3rd` : `${n}th` }
}

test('ThreeDaysGrog', () => {
    console.log = jest.fn();
    let m = new Cursor(init);
    expect(m.next().value).toEqual(undefined);
    expect(m).toMatchObject({food:0, hungry:0, sleepy:0, happy:1});

    m.jump(decide);
    for (let _ of m) {} 
    expect(m.value).toEqual(undefined);
    expect(m).toMatchObject({food:0, hungry:1, sleepy:1, happy:-1});

    m.jump(decide);
    for (let _ of m) {} 
    expect(m.value).toEqual(undefined);
    expect(m).toMatchObject({food:1, hungry:1, sleepy:2, happy:0});

    m.jump(decide);
    for (let _ of m) {} 
    expect(m.value).toEqual(undefined);
    expect(m).toMatchObject({food:0, hungry:0, sleepy:2, happy:1});
});
