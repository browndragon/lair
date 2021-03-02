import { jest, test, expect } from '@jest/globals';
import Tag from './tag';

class Log extends Tag {
    constructor() {
        super();
        this.log = [];
        this.strings = [];
        this.datas = [];
    }
    tag(s) { this.log.push(s); this.strings.push(s); }
    data(...d) { this.log.push(d); this.datas.push(d); }
    // No `next` provided; just inspect it.
    toString() { return this.log.toString() }
}

test('Happypath', () => {
    let TB = Log.tag;
    expect(TB`hello`('world')`!`).toEqual(TB);
    expect(TB.log).toEqual(['hello', ['world'], '!']);
    expect(TB.strings).toEqual(['hello', '!']);
    expect(TB.datas).toEqual([['world']]);
})

test('StringInterpolation', () => {
    let TB = Log.tag;
    expect(TB`hello${' '}``${'world'}${'!'}`).toEqual(TB);
    expect(TB.log).toEqual(['hello ', 'world!']);
    expect(TB.strings).toEqual(['hello ', 'world!']);
    expect(TB.datas).toEqual([]);
});

test('Differentiation', () => {
    let TB = Log.tag;
    expect(TB`string`('data')(['data2'])`string2`()).toEqual(TB);
    expect(TB.strings).toEqual(['string', 'string2']);
    expect(TB.datas).toEqual([['data'], [['data2']], []]);
});

test('Evaluate', () => {
    class Eval extends Log {
        constructor() {
            super();
            this.done = false;
        }
        data(...d) { this.log.push(...d); this.datas.push(...d); this.done = true; }
        next() {
            if (this.done) {
                return [...this.log];
            }
            return super.next();
        }
        clear() {
            this.done = false;
            this.log = [];
            this.strings = [];
            this.datas = [];
        }
    }
    let TB = Eval.tag;

    TB.clear();
    expect(TB()).toEqual([]);

    TB.clear();
    expect(TB('end')).toEqual(['end']);

    TB.clear();
    expect(TB`1`).toEqual(TB);
    expect(TB.log).toEqual(['1']);
    expect(TB`2`('3', 'end')).toEqual(['1', '2', '3', 'end']);
});

describe('Formatting', () => {
    class TB extends Tag {
        constructor() {
            super();
            this.o = '';
            this.done = false;
        }
        tag(s) { this.o += s }
        data() { this.done = true; }
        next() {
            if (!this.done) {
                return super.next();
            }
            this.done = false;
            let output = this.o;
            this.o = '';
            return output;
        }
    };
    test.each([
        [TB.tag``(), ''],
        [TB.tag` 1`(), ' 1'],
        [TB.tag`1 `(), '1 '],
        [TB.tag`1 2`(), '1 2'],
        [TB.tag` `(), ' '],
        // It's *very literal*.
        [TB.tag`\n`(), '\\n'],
        // AND vulnerable to whitespace manipulation.
        [TB.tag`
        `(), '\n        '],
        [TB.tag`
`(), '\n'],
        // But there are some workarounds:
        [TB.tag`${'i'}`(), 'i'],
        [TB.tag`${'\n'}`(), '\n'],
    ])('%#: %s=%s',(actual, expected) => expect(actual).toEqual(expected));
});