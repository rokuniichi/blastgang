import { EventConstructor, EventHandler } from "../../../../core/events/EventBus";
import { IEvent } from "../../../../core/events/IEvent";
import { SubscriptionGroup } from "../../../../core/events/SubscriptionGroup";
import { assertNotNull } from "../../../../core/utils/assert";
import { EventViewContext } from "../context/EventViewContext";
import { PresentationView } from "./PresentationView";

export abstract class EventPresentationView<TContext extends EventViewContext> extends PresentationView<TContext> {

    private readonly _subscriptions: SubscriptionGroup = new SubscriptionGroup();

    protected preInit(): void {
        assertNotNull(this.context.eventBus, this, "eventBus");
    }

    protected onDispose(): void {
        this._subscriptions.clear();
    }

    protected on<T extends IEvent>(type: EventConstructor<T>, handler: EventHandler<T>): void {
        const subscription = this.context.eventBus.on(type, handler);
        this._subscriptions.add(subscription);
    }

    protected emit<T extends IEvent>(event: T): void {
        this.context.eventBus.emit(event);
    }
}