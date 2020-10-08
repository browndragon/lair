export const ACTIVE = {
    event: 'active',
    callback: 'onActive'
};
export const COMPLETE = {
    event: 'complete',
    callback: 'onComplete'
};
export const Observables = { ACTIVE, COMPLETE };
export const Events = Object.fromEntries(Object.entries(Observables).map(([k, { event }]) => [k, event]));
export const Callbacks = Object.fromEntries(Object.entries(Observables).map(([k, { callback }]) => [k, callback]));