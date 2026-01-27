import { Subscription } from "./Subscription";

export class SubscriptionGroup {

    private _subscriptions: Subscription[] = [];

    public add(subscription: Subscription): void {
        this._subscriptions.push(subscription);
    }

    public clear(): void {
        this._subscriptions.forEach(s => s.unsubscribe());
        this._subscriptions.length = 0;
    }
}