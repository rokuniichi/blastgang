import { assertNumber } from "../../../../core/utils/assert";
import { ScoreUpdate } from "../../../domain/state/events/ScoreUpdate";
import { DynamicTextView } from "../../common/view/DynamicTextView";
import { ScoreTextViewContext } from "../context/ScoreTextViewContext";

const { ccclass } = cc._decorator;

@ccclass
export class ScoreTextView extends DynamicTextView<ScoreTextViewContext> {
    protected preInit(): void {
        super.preInit();
        assertNumber(this.context.targetScore, this, "initialValue");
    }

    protected eventType() {
        return ScoreUpdate;
    }

    protected format(value: number): string {
        return `${value}/${this.context.targetScore}`;
    }
}