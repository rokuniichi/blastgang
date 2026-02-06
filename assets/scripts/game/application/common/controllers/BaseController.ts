import { EventBus, EventConstructor, EventHandler } from "../../../../core/events/EventBus";
import { IEvent } from "../../../../core/events/IEvent";
import { SubscriptionGroup } from "../../../../core/events/SubscriptionGroup";
import { ILifecycle } from "../../../../core/lifecycle/ILifecycle";
import { assertNotNull } from "../../../../core/utils/assert";

export abstract class EventController implements ILifecycle {
    public constructor(private readonly eventBus: EventBus) { };

    private readonly _subscriptions: SubscriptionGroup = new SubscriptionGroup();

    private _initialized = false;

    public init(): void {
        if (this._initialized) return;
        this._initialized = true;

        this.preInit();
        this.onInit();
    }

    protected preInit(): void {
        assertNotNull(this.eventBus, this, "eventBus");
    }

    protected abstract onInit(): void;

    public dispose(): void {
        if (!this._initialized) return;
        this.onDispose();
    }

    protected onDispose(): void {
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