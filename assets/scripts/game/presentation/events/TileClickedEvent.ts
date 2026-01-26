import { IEvent } from "../../../core/event-system/IEvent";

export class TileClickedEvent implements IEvent {
    readonly type = "TileClickedEvent";

    constructor(
        public readonly x: number,
        public readonly y: number
    ) {}
}