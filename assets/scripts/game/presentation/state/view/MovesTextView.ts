import { MovesUpdate } from "../../../domain/state/events/MovesUpdate";
import { DynamicTextView } from "../../common/view/DynamicTextView";
import { PresentationViewContextConstructor } from "../../common/view/PresentationView";
import { MovesTextViewContext } from "../context/MovesTextViewContext";

const { ccclass } = cc._decorator;

@ccclass
export class MovesTextView extends DynamicTextView<MovesTextViewContext> {

    public contextConstructor(): PresentationViewContextConstructor<MovesTextViewContext> {
        return MovesTextViewContext;
    }
    protected eventType() {
        return MovesUpdate;
    }

    protected format(value: number): string {
        return value.toString();
    }
}