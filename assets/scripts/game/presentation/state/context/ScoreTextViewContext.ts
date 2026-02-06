import { DynamicTextViewContext } from "../../common/context/DynamicTextViewContext";
import { PresentationGraph } from "../../PresentationGraph";

export class ScoreTextViewContext extends DynamicTextViewContext {
    readonly targetScore: number;

    public constructor(presentation: PresentationGraph) {
        super(presentation);
        this.targetScore = presentation.targetScore;
    }

    protected initialValue(): number {
        return this.presentation.currentScore;
    }
}