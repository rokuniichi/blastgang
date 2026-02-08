import { BoosterType } from "../../../domain/state/models/BoosterType";
import { DynamicTextViewContext } from "../../common/context/DynamicTextViewContext";
import { PresentationGraph } from "../../PresentationGraph";

export class BoosterViewContext extends DynamicTextViewContext {
    private readonly _type: BoosterType;

    public constructor(presentation: PresentationGraph, type: BoosterType) {
        super(presentation);
        this._type = type;

        const value = this.presentation.boosters.get(this._type);
        this.setInitial(value);
    }
}