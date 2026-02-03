import { IEvent } from "../../../../core/events/IEvent";

export class GameStateSync implements IEvent {
    public constructor(public readonly destroyed: number) { };
}