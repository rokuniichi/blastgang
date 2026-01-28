import { EventBus } from "../../../../core/events/EventBus";

export interface EventViewContext {
    readonly eventBus: EventBus;
}