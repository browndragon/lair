/** Interface for objects obeying Newton's Third Law (equal and opposite). */
export default class Force {
    /** By convention, the force on object A. */
    force(pma, pmb) {
        throw 'undefined';
    }
}