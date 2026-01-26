import { SubscriptionGroup } from "../../../core/event-system/SubscriptionGroup";

export abstract class BaseController {

    protected readonly subscriptions = new SubscriptionGroup();

    public unsubscribe(): void {
        this.subscriptions.clear();
    }
}