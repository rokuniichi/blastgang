import { IEvent } from "./IEvent";

export class ValueChangedEvent implements IEvent {
    public constructor(public readonly value: number) {}
}