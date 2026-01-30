import { EventBus, EventConstructor, EventHandler } from "../../../../core/events/EventBus";
import { IEvent } from "../../../../core/events/IEvent";
import { Subscription } from "../../../../core/events/Subscription";
import { SubscriptionGroup } from "../../../../core/events/SubscriptionGroup";
import { assertNotNull } from "../../../../core/utils/assert";
import { EventViewContext } from "../context/EventViewContext";
import { ContextView } from "./ContextView";

export abstract class EventView<TContext extends EventViewContext> extends ContextView<TContext> {

    protected eventBus!: EventBus;
    private readonly _subscriptions: SubscriptionGroup = new SubscriptionGroup();

    protected preInit(): void {
        assertNotNull(this.context.eventBus, this, "eventBus");
        this.eventBus = this.context.eventBus;
    }

    protected onDispose(): void {
        super.onDispose();
        this._subscriptions.clear();
    }

    protected on<T extends IEvent>(type: EventConstructor<T>, handler: EventHandler<T>): void {
        const subscription = this.eventBus.on(type, handler);
        this._subscriptions.add(subscription);
    }

    protected emit<T extends IEvent>(event: T): void {
        this.eventBus.emit(event);
    }
}