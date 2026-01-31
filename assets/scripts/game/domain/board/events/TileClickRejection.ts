import { IEvent } from "../../../../core/events/IEvent";
import { TilePosition } from "../models/TilePosition";

export enum TileClickRejectionReason {
    NO_CLUSTER,
    LOCKED
}

export class TileClickRejection implements IEvent {
    public constructor(
        public readonly reason: TileClickRejectionReason,
        public readonly position: TilePosition
    ) { }
}