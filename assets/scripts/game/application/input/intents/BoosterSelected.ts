import { IEvent } from "../../../../core/eventbus/IEvent";
import { BoosterType } from "../../../domain/state/models/BoosterType";

export class BoosterSelected implements IEvent {
    constructor(public readonly type: BoosterType) { }
}