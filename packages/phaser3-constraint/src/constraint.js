// import Phaser from 'phaser';  // Peer dependency; user must import this!
export default function Constraint(clazz) {
    if (clazz[B]) {
        return clazz;
    }
    return class extends clazz {
        static get [B]() { return true }
        
    }
}
const B = Symbol('Bonded');