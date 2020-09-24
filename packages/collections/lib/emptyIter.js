export default {
    done: true,
    next() {
        return this;
    },
    [Symbol.iterator]() {
        return this;
    }
};