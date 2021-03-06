export default function val(f) {
    switch (typeof(f)) {
        case 'function': return f();
        default: return f;
    }
}
