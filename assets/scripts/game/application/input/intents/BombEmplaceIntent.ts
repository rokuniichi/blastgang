import { IEvent } from "../../../../core/eventbus/IEvent";
import { TileId } from "../../../domain/board/models/BoardLogicModel";

export class BombEmplaceIntent implements IEvent {
    constructor(public readonly id: TileId) { }
}