import {Table} from '@browndragon/collections';

export const DELETING = Symbol('Deleting');

export const NilSubscriber = {
    receive(_topic, _message) {},
    unsubscribe(_topic) {},
};

/**
 * Asynchronous pubsub system.
 * Manage subscribers with `subscribe`.
 * Offer publication with `publish`.
 * You can unsubscribe a specific subscriber with `unsubscribe`, or close a topic with `delete`.
 * Subscribe is resolved synchronously, but publish is resolved asynchronously, during a call you must make to `deliver`. As a result, there is no good pattern to remove/re-add something.
 * Which is why this is a demo.
 */
export default class Pubsub {
    constructor() {
        // Rows are topics, columns are subscribers.
        this.t = new Table();
        this.q = [];
    }

    subscribe(topic, subscriber) {
        this.t.set(topic, subscriber, true);
        return this;
    }
    unsubscribe(topic, subscriber) {
        if (!this.t.has(topic, subscriber)) {
            return this;
        }
        subscriber.unsubscribe(topic);
        this.t.delete(topic, subscriber);
        return this;
    }

    publish(topic, message=undefined) {
        this.q.push([topic, message]);
        return;
    }
    delete(topic) {
        this.publish(topic, DELETING);
        return;
    }

    deliver() {
        let q = this.q;
        if (q.length <= 0) {
            return;
        }
        this.q = [];
        for (let [topic, message] of q) {
            if (message == DELETING) {
                for (let subscriber of this.t.colsInRow(topic)) {
                    this.unsubscribe(topic, subscriber);
                }
                return;
            }
            for (let subscriber of this.t.colsInRow(topic)) {
                subscriber.receive(topic, message);
            }
        }
    }
}