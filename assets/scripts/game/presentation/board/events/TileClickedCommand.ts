import { IEvent } from "../../../../core/events/IEvent";
import { TilePosition } from "../../../domain/board/models/TilePosition";

export class TileClickedCommand implements IEvent {
    public constructor(public readonly position: TilePosition) { }
}