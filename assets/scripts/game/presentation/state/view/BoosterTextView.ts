import { BoosterUsed } from "../../../domain/state/events/BoosterUsed";
import { DynamicTextView } from "../../common/view/DynamicTextView";
import { PresentationViewContextConstructor } from "../../common/view/PresentationView";
import { BoosterTextViewContext } from "../context/BoosterTextViewContext";

const { ccclass } = cc._decorator;

@ccclass
export class BoosterTextView extends DynamicTextView<BoosterTextViewContext> {
    public contextConstructor(): PresentationViewContextConstructor<BoosterTextViewContext> {
        throw new Error("Method not implemented.");
    }

    protected eventType() {
        return BoosterUsed;
    }

    protected accept(event: BoosterUsed): boolean {
        return event.type === this.context.boosterType;
    }

    protected format(value: number): string {
        return value.toString();
    }
}