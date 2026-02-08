import { MovesUpdate } from "../../../domain/state/events/MovesUpdate";
import { DynamicTextView } from "../../common/view/DynamicTextView";
import { PresentationViewContextFactory } from "../../common/view/PresentationView";
import { PresentationGraph } from "../../PresentationGraph";
import { MovesTextViewContext } from "../context/MovesTextViewContext";

const { ccclass } = cc._decorator;

@ccclass
export class MovesTextView extends DynamicTextView<MovesTextViewContext> {
    public contextFactory(): PresentationViewContextFactory<MovesTextViewContext> {
        return (presentation: PresentationGraph) => new MovesTextViewContext(presentation);
    }

    protected eventType() {
        return MovesUpdate;
    }

    protected format(value: number): string {
        return value.toString();
    }
}