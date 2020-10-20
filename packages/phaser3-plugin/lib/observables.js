"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Callbacks = exports.Events = exports.Observables = exports.COMPLETE = exports.ACTIVE = void 0;
const ACTIVE = {
  event: 'active',
  callback: 'onActive'
};
exports.ACTIVE = ACTIVE;
const COMPLETE = {
  event: 'complete',
  callback: 'onComplete'
};
exports.COMPLETE = COMPLETE;
const Observables = {
  ACTIVE,
  COMPLETE
};
exports.Observables = Observables;
const Events = Object.fromEntries(Object.entries(Observables).map(([k, {
  event
}]) => [k, event]));
exports.Events = Events;
const Callbacks = Object.fromEntries(Object.entries(Observables).map(([k, {
  callback
}]) => [k, callback]));
exports.Callbacks = Callbacks;