import { DynamicTextViewContext } from "../../common/context/DynamicTextViewContext";

export class MovesTextViewContext extends DynamicTextViewContext {
    protected initialValue(): number {
        return this.presentation.movesLeft;
    }
}