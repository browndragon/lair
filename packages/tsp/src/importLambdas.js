//    import Phaser from 'phaser';
import Callable from '@browndragon/callable';

export default class ImportLambdas extends Callable {
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
};