import { EventBus, EventConstructor, EventHandler } from "../../../core/event-system/EventBus";
import { IEvent } from "../../../core/event-system/IEvent";
import { Subscription } from "../../../core/event-system/Subscription";
import { SubscriptionGroup } from "../../../core/event-system/SubscriptionGroup";
import { assertNotNull } from "../../../core/utils/assert";
import { ContextView } from "./ContextView";

export abstract class EventView<TContext extends { eventBus: EventBus }>
    extends ContextView<TContext> {

    protected eventBus!: EventBus;
    private readonly subscriptions: SubscriptionGroup = new SubscriptionGroup();

    protected override preInit(): void {
        this.eventBus = this.context.eventBus;
        assertNotNull(this.eventBus, this, "eventBus");
    }

    protected override postInit(): void {
        this.subscribe();
    }

    protected subscribe(): void {}

    protected override onDispose(): void {
        this.unsubscribe();
        this.subscriptions.clear();
    }

    protected unsubscribe(): void {}

    protected on<T extends IEvent>(type: EventConstructor<T>, handler: EventHandler<T>): void {
        const sub: Subscription = this.eventBus.on(type, handler);
        this.subscriptions.add(sub);
    }

    protected emit<T extends IEvent>(event: T): void {
        this.eventBus.emit(event);
    }
}