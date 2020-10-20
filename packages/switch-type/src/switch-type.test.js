import { describe, test, expect } from '@jest/globals';
import switchType from './switch-type';

describe('SwitchType', () => {
    test.each([
        {h:{}, e:undefined},
        {h:{undefined(__obj) {return 7}}, e:7},
        {h:{null(_obj) {return 7}}, e:7},
        {h:{value(_obj) {return 7}}, e:undefined},
        {h:{default(_obj) {return 7}}, e:7},
        {h:{number(_obj) {return 7}}, e:undefined},
        {h:{undefined(_obj) {return 1}, null(_obj) {return 2}, default(_obj) {return 3}}, e:1},
        {h:{null(_obj) {return 2}, default(_obj) {return 3}}, e:2},        
    ])('undefined %#', ({h, e}) => {
        expect(switchType(undefined, h)).toBe(e);
    });
    test.each([
        {h:{}, e:undefined},
        {h:{undefined(_obj) {return 7}}, e:7},
        {h:{null(_obj) {return 7}}, e:7},
        {h:{default(_obj) {return 7}}, e:7},
        {h:{value(_obj) {return 7}}, e:undefined},
        {h:{number(_obj) {return 7}}, e:undefined},
        {h:{null(_obj) {return 1}, undefined(_obj) {return 2}, default(_obj) {return 3}}, e:1},
        {h:{undefined(_obj) {return 2}, default(_obj) {return 3}}, e:2},        
    ])('null %#', ({h, e}) => {
        expect(switchType(null, h)).toBe(e);
    });

    test.each([
        {h:{}, e:undefined},
        {h:{undefined(_obj) {return 7}}, e:undefined},
        {h:{number(obj) {return obj}}, e:0},
        {h:{number(obj) {return 2+obj}}, e:2},
        {h:{value(obj) {return 3+obj}}, e:3},
        {h:{number(obj) {return 4+obj}, value(obj) { return 5 * obj}}, e:4},
    ])('0 %#', ({h, e}) => {
        expect(switchType(0, h)).toBe(e);
    });

    test.each([
        {h:{}, e:undefined},
        {h:{undefined(_obj) {return 7}}, e:undefined},
        {h:{number(obj) {return 2+obj}}, e:19},
        {h:{value(obj) {return 3+obj}}, e:20},
        {h:{number(obj) {return 4+obj}, value(obj) { return 5+obj}}, e:21},
    ])('17 %#', ({h, e}) => {
        expect(switchType(17, h)).toBe(e);
    });

    test.each([
        {h:{}, e:undefined},
        {h:{undefined(_obj) {return 7}}, e:undefined},
        {h:{number(obj) {return 1+obj.length}}, e:undefined},
        {h:{string(obj) {return 2+obj.length}}, e:2},
        {h:{value(obj) {return 3+obj.length}}, e:3},
        {h:{string(obj) {return 4+obj.length}, value(obj) { return 5+obj.length}}, e:4},
    ])('nilstr %#', ({h, e}) => {
        expect(switchType('', h)).toBe(e);
    });

    test.each([
        {h:{}, e:undefined},
        {h:{undefined(_obj) {return 7}}, e:undefined},
        {h:{number(obj) {return 1 + obj.length}}, e:undefined},
        {h:{string(obj) {return 2 + obj.length}}, e:5},
        {h:{value(obj) {return 3+obj.length}}, e:6},
        {h:{string(obj) {return 4+obj.length}, value(obj) { return 5+obj.length}}, e:7},
        {h:{value(obj) { return 5+obj.length}, iterable(obj) {return 6+obj.length}}, e:8},
    ])('str %#', ({h, e}) => {
        expect(switchType('str', h)).toBe(e);
    });

    test.each([
        {h:{}, e:undefined},
        {h:{undefined(_obj) {return 7}}, e:undefined},
        {h:{associative(_obj) {return 1}}, e:1},
        {h:{literal(_obj) {return 2}}, e:2},
        {h:{literal(_obj) {return 3}, associative(_obj) {return 4}}, e:3},
    ])('{} %#', ({h, e}) => {
        expect(switchType({}, h)).toBe(e);
    });

    test.each([
        {h:{}, e:undefined},
        {h:{undefined(_obj) {return 7}}, e:undefined},
        {h:{associative(_obj) {return 1}}, e:1},
        {h:{literal(_obj) {return 2}}, e:2},
        {h:{literal(_obj) {return 3}, associative(_obj) {return 4}}, e:3},
        {h:{literal(_obj) {return 5}, object(_obj) {return 6}}, e:5},
        {h:{object(_obj) {return 7}}, e:7},
    ])('{a:1} %#', ({h, e}) => {
        expect(switchType({a:1}, h)).toBe(e);
    });

    test.each([
        {h:{}, e:undefined},
        {h:{literal(_obj) {return 1}}, e:undefined},
        {h:{map(_obj) {return 2}}, e:2},
        {h:{associative(_obj) {return 2}}, e:2},
        {h:{iterable(_obj) {return 3}}, e:3},
        {h:{map(_obj) {return 4}, iterable(_obj) {return 5}}, e:4},
        {h:{map(_obj) {return 5}, object(_obj) {return 6}}, e:5},
        {h:{object(_obj) {return 6}}, e:6},
    ])('Map %#', ({h, e}) => {
        expect(switchType(new Map(), h)).toBe(e);
    });

    test.each([
        {h:{}, e:undefined},
        {h:{literal(_obj) {return 1}}, e:undefined},
        {h:{array(_obj) {return 2}}, e:2},
        {h:{iterable(_obj) {return 3}}, e:3},
        {h:{array(_obj) {return 4}, iterable(_obj) {return 5}}, e:4},
        {h:{array(_obj) {return 5}, object(_obj) {return 6}}, e:5},
        {h:{object(_obj) {return 6}}, e:6},
    ])('Array %#', ({h, e}) => {
        expect(switchType([1, 2, 3], h)).toBe(e);
    });
})