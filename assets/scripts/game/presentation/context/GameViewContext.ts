import { EventBus } from "../../../core/event-system/EventBus";
import { GameStateModel } from "../../domain/state/models/GameStateModel";

export interface GameViewContext {
    readonly eventBus: EventBus;
    readonly gameStateModel: GameStateModel;
}