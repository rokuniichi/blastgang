import { MovesUpdatedEvent } from "../../../domain/state/events/MovesUpdatedEvent";
import { DynamicTextView } from "../../common/view/DynamicTextView";
import { MovesTextViewContext } from "../context/MovesTextViewContext";

const { ccclass } = cc._decorator;

@ccclass
export class MovesTextView extends DynamicTextView<MovesTextViewContext> {
    protected eventType() {
        return MovesUpdatedEvent;
    }

    protected format(value: number): string {
        return value.toString();
    }
}