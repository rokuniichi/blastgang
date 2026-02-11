import { IEvent } from "../../../../core/eventbus/IEvent";
import { TilePosition } from "../../../domain/board/models/TilePosition";

export class RocketOutOfBounds implements IEvent {
    public constructor(public readonly node: cc.Node) { }
}