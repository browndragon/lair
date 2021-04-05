"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _callable = _interopRequireDefault(require("@browndragon/callable"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//    import Phaser from 'phaser';
class ImportLambdas extends _callable.default {
  constructor() {
    super((lambda, ctx, ...params) => this.add(lambda, ctx, ...params));
    this.lambdas = [];
  }

  add(lambda, ctx, ...params) {
    this.lambdas.push([lambda, ctx, params]);
  }

  removeContext(ctx) {
    this.lambdas = this.lambdas.filter(([l, c, p]) => c != ctx);
  }

  clear() {
    this.lambdas = [];
  }

  runAll(...args) {
    for (let [lambda, ctx, params] of this.lambdas) {
      lambda.call(ctx, ...args, ...params);
    }
  }

}

exports.default = ImportLambdas;
;