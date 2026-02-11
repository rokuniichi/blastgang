import { IEvent } from "../../../../core/eventbus/IEvent";
import { TileId } from "../../../domain/board/models/BoardLogicModel";

export class SwapSelected implements IEvent {
    constructor(public readonly id: TileId, public readonly state: boolean) { }
}