import { PresentationGraph } from "../../PresentationGraph";
import { EventViewContext } from "./EventViewContext";

export abstract class DynamicTextViewContext extends EventViewContext {
    readonly initial: number;

    public constructor(presentation: PresentationGraph) {
        super(presentation);
        this.initial = this.initialValue();
    }

    protected abstract initialValue(): number;
}