export default class Span {
    constructor(begin, end, reverse) {
        this[B] = begin;
        this[E] = end;
        this[R] = reverse;
    }
    get begin() { return this[B]; }
    get end() { return this[E]; }
    [Symbol.iterator]() { return [this.begin, this.end][Symbol.iterator]() }

    static of(x) {
        if (x instanceof Span) {
            return x;
        }
        if (Array.isArray(x)) {
            return new Span(...x);
        }
        return new Span(x, x);
    }
    test(x) {
        return this.contains(x);
    }
    contains(x) {
        if (x instanceof Span) {
            return this.begin <= x.begin && x.end <= this.end;
        }
        return this.begin <= x && x < this.end;
    }
    overlaps(x) {
        return !this.before(x) && !this.after(x);
    }
    before(x) {
        if (x instanceof Span) {
            return this.end < x.begin;
        }
        return this.end <= x;
    }
    after(x) {
        if (x instanceof Span) {
            return x.end < this.begin;
        }
        return x < this.begin;
    }
    toString() {
        return `[${this.begin}, ${this.end})`;
    }
}
const B = Symbol('begin');
const E = Symbol('end');
const R = Symbol('reverse');