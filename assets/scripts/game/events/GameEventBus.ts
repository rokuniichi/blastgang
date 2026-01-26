import { GameEvent } from "./GameEvent";

type Handler<T> = (payload?: T) => void;

export class GameEventBus {

    private _listeners: Map<GameEvent, Handler<any>[]> = new Map();

    public on<TPayload>(event: GameEvent, handler: Handler<TPayload>): void {
        const handlers = this._listeners.get(event) ?? [];
        handlers.push(handler);
        this._listeners.set(event, handlers);
    }

    public emit<TPayload>(event: GameEvent, payload?: TPayload): void {
        const handlers = this._listeners.get(event);
        if (!handlers) return;
        handlers.forEach(h => h(payload));
    }

    public clear(): void {
        this._listeners.clear();
    }
}