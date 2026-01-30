import { IEvent } from "../../../../core/events/IEvent";
import { TilePosition } from "../models/TilePosition";

export enum TileClickRejectedReason {
    NO_CLUSTER,
    LOCKED
}

export class TileClickRejectedEvent implements IEvent {
    constructor(
        public readonly reason: TileClickRejectedReason,
        public readonly position: TilePosition
    ) {}
}