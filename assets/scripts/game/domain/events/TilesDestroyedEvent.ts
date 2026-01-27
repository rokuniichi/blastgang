import { IEvent } from "../../../core/event-system/IEvent";
import { TilePosition } from "../models/TilePosition";

export class TilesDestroyedEvent implements IEvent {

    public readonly tiles: readonly TilePosition[];

    public constructor(tiles: readonly TilePosition[]) {
        this.tiles = tiles;
    }
}