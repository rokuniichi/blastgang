import { IEvent } from "./IEvent";
import { Subscription } from "./Subscription";

type EventConstructor<T extends IEvent> = new (...args: any[]) => T;
type Handler<T extends IEvent> = (event: T) => void;

export class EventBus {

    private _listeners = new Map<EventConstructor<any>, Handler<any>[]>();

    public on<T extends IEvent>(eventType: EventConstructor<T>, handler: Handler<T>): Subscription {
        const handlers = this._listeners.get(eventType) ?? [];
        handlers.push(handler);
        this._listeners.set(eventType, handlers);

        return { unsubscribe: () => this.off(eventType, handler) };
    }

    public off<T extends IEvent>(eventType: EventConstructor<T>, handler: Handler<T>): void {
        const handlers = this._listeners.get(eventType);
        if (!handlers) return;

        const index = handlers.indexOf(handler);
        if (index !== -1) {
            handlers.splice(index, 1);
        }
    }

    public emit<T extends IEvent>(event: T): void {const handlers = this._listeners.get(event.constructor as EventConstructor<T>);
        if (!handlers) return;

        [...handlers].forEach(h => h(event));
    }

    public clear(): void {
        this._listeners.clear();
    }
}