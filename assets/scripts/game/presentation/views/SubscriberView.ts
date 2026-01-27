import { EventBus } from "../../../core/event-system/EventBus";
import { IEvent } from "../../../core/event-system/IEvent";
import { SubscriptionGroup } from "../../../core/event-system/SubscriptionGroup";
import { ensureNotNull } from "../../../core/utils/ensure";
import { BaseView } from "./BaseView";

export abstract class SubscriberView extends BaseView {
    protected readonly subscriptions = new SubscriptionGroup();

    private _eventBus!: EventBus;
    private _initialized = false;
    private _disposed = false;

    public init(eventBus: EventBus, ...args: any[]): void {
        if (this._initialized) return;
        this._initialized = true;

        this._eventBus = ensureNotNull(eventBus, this, "eventBus");
        this.onInit(...args);
        this.subscribe();
    }

    protected abstract onInit(...args: any[]): void;

    protected abstract subscribe(): void;

    protected on<T extends IEvent>(eventType: new (...args: any[]) => T, handler: (event: T) => void): void {
        this.subscriptions.add(
            this._eventBus.on(eventType, handler)
        );
    }

    protected emit(event: IEvent): void {
        this._eventBus.emit(event);
    }

    public dispose(): void {
        if (this._disposed) return;
        this._disposed = true;
        this.unsubscribe();
    }

    protected onDestroy(): void {
        this.dispose();
    }

    private unsubscribe(): void {
        this.subscriptions.clear();
    }
}