/** es6 fake a Callable class. */
export default class Callable extends Function {
    constructor(f) {
        return Object.setPrototypeOf(f, new.target.prototype);
    }
}