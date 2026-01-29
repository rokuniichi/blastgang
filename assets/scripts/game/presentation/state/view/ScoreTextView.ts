import { assertNumber } from "../../../../core/utils/assert";
import { ScoreUpdatedEvent } from "../../../domain/state/events/ScoreUpdatedEvent";
import { DynamicTextView } from "../../core/view/DynamicTextView";
import { ScoreTextViewContext } from "../context/ScoreTextViewContext";

const { ccclass } = cc._decorator;

@ccclass
export class ScoreTextView extends DynamicTextView<ScoreTextViewContext> {
    protected preInit(): void {
        super.preInit();
        assertNumber(this.context.targetScore, this, "initialValue");
    }

    protected eventType() {
        return ScoreUpdatedEvent;
    }

    protected format(value: number): string {
        return `${value}/${this.context.targetScore}`;
    }
}