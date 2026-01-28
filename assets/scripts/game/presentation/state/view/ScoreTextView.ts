import { ScoreUpdatedEvent } from "../../../domain/state/events/ScoreUpdatedEvent";
import { DynamicTextView } from "../../core/view/DynamicTextView";
import { ScoreTextViewContext } from "../context/ScoreTextViewContext";

const { ccclass } = cc._decorator;

@ccclass
export class ScoreTextView extends DynamicTextView<ScoreTextViewContext> {
    protected eventType() {
        return ScoreUpdatedEvent;
    }

    protected format(value: number): string {
        return `${value}/${this.context.targetScore}`;
    }
}