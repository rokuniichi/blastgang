import { IEvent } from "../../../../core/eventbus/IEvent";
import { TileId } from "../../../domain/board/models/BoardLogicModel";

export class NormalClickIntent implements IEvent {
    constructor(public readonly id: TileId) { }
}