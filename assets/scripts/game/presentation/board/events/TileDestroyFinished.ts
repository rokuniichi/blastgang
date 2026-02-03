import { TileId } from "../../../domain/board/models/BoardLogicalModel";
import { IVisualEvent } from "./IVisualEvent";

export class TileDestroyFinished implements IVisualEvent {
    public constructor(public readonly id: TileId) { }
}