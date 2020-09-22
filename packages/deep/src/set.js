import destructureRight from '@browndragon/func';
import obj from '@browndragon/obj';

export const NOPARENT = Symbol('NoCreateParents');
export default function set(...params) {
    if (params.length < 3) {
        throw new TypeError('Not enough parameters for set');
    }
    let createParents = true;
    for (let i = 0; i < params.length; ++i) {
        const p = params[i];
        switch (p) {
            case NOPARENT:
                createParents=false;
                break;
            default: {
                if (params.length - i < 3) {
                    throw new TypeError('Not enough parameters for set');
                }
                // switch parsing modes!
                let o = p;
                for(; i < params.length - 2; ++i) {
                    let c = obj.underwrite(o, k);
                    if (!(c instanceof Object)) {
                        if (createParents) {
                            c = obj.set(o, k, {});
                        } else {
                            return undefined;
                        }
                    }
                }
                const k = params[params.length - 2];
                const v = params[params.length - 1];
                return obj.set(o, k, v);
            }
        }
    }
}