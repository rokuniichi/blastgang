import { DynamicTextViewContext } from "../../common/context/DynamicTextViewContext";
import { PresentationGraph } from "../../PresentationGraph";

export class MovesTextViewContext extends DynamicTextViewContext {
    public constructor(presentation: PresentationGraph) {
        super(presentation);
        this.setInitial(this.presentation.movesLeft);
    }
}