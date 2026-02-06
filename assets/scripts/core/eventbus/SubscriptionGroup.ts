import { Subscription } from "./Subscription";

export class SubscriptionGroup {

    private readonly _subscriptions: Subscription[];

    public constructor() {
        this._subscriptions = [];
    }

    public add(sub: Subscription): void {
        this._subscriptions.push(sub);
    }

    public clear(): void {
        for (const sub of this._subscriptions) {
            sub.unsubscribe();
        }
        this._subscriptions.length = 0;
    }
}