import { assertNumber } from "../../../../core/utils/assert";
import { ScoreUpdate } from "../../../application/state/events/ScoreUpdate";
import { DynamicTextView } from "../../common/view/DynamicTextView";
import { PresentationViewContextFactory } from "../../common/view/PresentationView";
import { PresentationGraph } from "../../PresentationGraph";
import { ScoreTextViewContext } from "../context/ScoreTextViewContext";

const { ccclass } = cc._decorator;

@ccclass
export class ScoreTextView extends DynamicTextView<ScoreTextViewContext> {
    public contextFactory(): PresentationViewContextFactory<ScoreTextViewContext> {
        return (presentation: PresentationGraph) => new ScoreTextViewContext(presentation);
    }

    protected eventType() {
        return ScoreUpdate;
    }

    protected preInit(): void {
        super.preInit();
        assertNumber(this.context.targetScore, this, "initialValue");
    }

    protected format(value: number): string {
        return `${value}/${this.context.targetScore}`;
    }
}