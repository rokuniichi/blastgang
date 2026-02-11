import { IEvent } from "../../../../core/eventbus/IEvent";
import { TilePosition } from "../../../domain/board/models/TilePosition";

export class RocketCrossed implements IEvent {
    public constructor(public readonly position: TilePosition) { }
}