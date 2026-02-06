import { ValueChangedEvent } from "../../../../core/eventbus/ValueChangedEvent";
import { BoosterType } from "../models/BoosterType";

export class BoosterUsed extends ValueChangedEvent {
    public readonly type: BoosterType;

    public constructor(type: BoosterType, value: number) {
        super(value);
        this.type = type;
    }
} 