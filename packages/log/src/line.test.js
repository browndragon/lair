import { jest, test, expect } from '@jest/globals';
import Line from './line';

describe('Line Tests', () => {
    console.assert = (statement, message) => {
      if (!statement) throw new Error(message);
    };
    test('One', () => {
        expect(Line.tag`Hello`).toEqual({text:'Hello'});
    });
    test('Two', () => {
        expect(Line.tag`Hello`).toEqual({text:'Hello'});
        expect(Line.tag`World`).toEqual({text:'World'});
    });
    test('Speaker', () => {
        expect(Line.tag({speaker:'me'})`Hello`).toEqual({text:'Hello', speaker:'me'});
    });
    test('Action', () => {
        expect(Line.tag({action:'die'})).toEqual({action:'die'});
    });
});
