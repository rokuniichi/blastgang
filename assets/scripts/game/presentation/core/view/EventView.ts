import { EventBus, EventConstructor, EventHandler } from "../../../../core/events/EventBus";
import { IEvent } from "../../../../core/events/IEvent";
import { Subscription } from "../../../../core/events/Subscription";
import { SubscriptionGroup } from "../../../../core/events/SubscriptionGroup";
import { assertNotNull } from "../../../../core/utils/assert";
import { EventViewContext } from "../context/EventViewContext";
import { ContextView } from "./ContextView";

export abstract class EventView<TContext extends EventViewContext> extends ContextView<TContext> {

    protected eventBus!: EventBus;
    private readonly subscriptions: SubscriptionGroup = new SubscriptionGroup();

    protected override preInit(): void {
        assertNotNull(this.context.eventBus, this, "eventBus");
        this.eventBus = this.context.eventBus;
    }

    protected override postInit(): void {
        this.subscribe();
    }

    protected subscribe(): void { }

    protected override onDispose(): void {
        this.unsubscribe();
        this.subscriptions.clear();
    }

    protected unsubscribe(): void { }

    protected on<T extends IEvent>(type: EventConstructor<T>, handler: EventHandler<T>): void {
        const sub: Subscription = this.eventBus.on(type, handler);
        this.subscriptions.add(sub);
    }

    protected emit<T extends IEvent>(event: T): void {
        this.eventBus.emit(event);
    }
}