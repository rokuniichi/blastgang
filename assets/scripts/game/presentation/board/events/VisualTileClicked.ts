import { IEvent } from "../../../../core/events/IEvent";
import { TilePosition } from "../../../domain/board/models/TilePosition";

export class VisualTileClicked implements IEvent {
    public constructor(public readonly position: TilePosition) { }
}