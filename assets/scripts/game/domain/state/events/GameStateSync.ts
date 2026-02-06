import { IEvent } from "../../../../core/eventbus/IEvent";

export class GameStateSync implements IEvent {
    public constructor(public readonly destroyed: number) { };
}