import { IEvent } from "./IEvent";
import { Subscription } from "./Subscription";

export type EventConstructor<T extends IEvent> = new (...args: any[]) => T;
export type EventHandler<T extends IEvent> = (event: T) => void;

export class EventBus {

    private readonly listeners: Map<EventConstructor<IEvent>, EventHandler<IEvent>[]> = new Map();

    public on<T extends IEvent>(
        eventType: EventConstructor<T>,
        handler: EventHandler<T>
    ): Subscription {
        const handlers: EventHandler<IEvent>[] =
            this.listeners.get(eventType) ?? [];

        handlers.push(handler as EventHandler<IEvent>);
        this.listeners.set(eventType, handlers);

        return {
            unsubscribe: (): void => this.off(eventType, handler)
        };
    }

    public off<T extends IEvent>(
        eventType: EventConstructor<T>,
        handler: EventHandler<T>
    ): void {
        const handlers = this.listeners.get(eventType);
        if (!handlers) return;

        const index: number = handlers.indexOf(handler as EventHandler<IEvent>);
        if (index !== -1) {
            handlers.splice(index, 1);
        }
    }

    public emit<T extends IEvent>(event: T): void {
        const handlers = this.listeners.get(
            event.constructor as EventConstructor<IEvent>
        );

        if (!handlers) return;

        for (const handler of handlers) {
            handler(event);
        }
    }

    public clear(): void {
        this.listeners.clear();
    }
}