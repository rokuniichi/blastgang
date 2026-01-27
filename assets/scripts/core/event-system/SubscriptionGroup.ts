import { Subscription } from "./Subscription";

export class SubscriptionGroup {

    private readonly subs: Subscription[];

    public constructor() {
        this.subs = [];
    }

    public add(sub: Subscription): void {
        this.subs.push(sub);
    }

    public clear(): void {
        for (const sub of this.subs) {
            sub.unsubscribe();
        }
        this.subs.length = 0;
    }
}