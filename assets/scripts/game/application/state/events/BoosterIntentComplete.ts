import { IEvent } from "../../../../core/eventbus/IEvent";
import { BoosterType } from "../../../domain/state/models/BoosterType";

export class BoosterIntentComplete implements IEvent {
    public constructor(public readonly type: BoosterType) { }
}