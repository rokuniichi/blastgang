import { ISubscription } from "./ISubscription";

export class SubscriptionGroup {

    private _subscriptions: ISubscription[] = [];

    public add(subscription: ISubscription): void {
        this._subscriptions.push(subscription);
    }

    public clear(): void {
        this._subscriptions.forEach(s => s.unsubscribe());
        this._subscriptions.length = 0;
    }
}