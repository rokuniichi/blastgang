import { IEvent } from "../../../core/event-system/IEvent";
import { TilePosition } from "../../domain/models/TilePosition";

export class TileClickedEvent implements IEvent {

    public readonly position: TilePosition;

    public constructor(position: TilePosition) {
        this.position = position;
    }
}