import { IEvent } from "../../../../core/eventbus/IEvent";
import { TileId } from "../../../domain/board/models/BoardLogicModel";

export class VisualTileLanded implements IEvent {
    public constructor(public readonly id: TileId) { }
}