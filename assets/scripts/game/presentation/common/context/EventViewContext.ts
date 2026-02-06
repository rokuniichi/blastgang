import { EventBus } from "../../../../core/events/EventBus";
import { PresentationGraph } from "../../PresentationGraph";
import { PresentationViewContext } from "../view/PresentationViewContext";

export class EventViewContext extends PresentationViewContext {
    public readonly eventBus: EventBus;

    public constructor(presentation: PresentationGraph) {
        super(presentation);
        this.eventBus = presentation.eventBus;
    }
}