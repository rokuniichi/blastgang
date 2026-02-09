import { IEvent } from "../../../../core/eventbus/IEvent";
import { TileId } from "../../../domain/board/models/BoardLogicModel";

export class SwapClickIntent implements IEvent {
    constructor(public readonly first: TileId, public readonly second: TileId) { }
}