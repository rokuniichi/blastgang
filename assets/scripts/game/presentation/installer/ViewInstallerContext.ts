import { EventBus } from "../../../core/events/EventBus";
import { BoardModel } from "../../domain/board/models/BoardModel";
import { GameStateModel } from "../../domain/state/models/GameStateModel";

export interface ViewInstallerContext {
    readonly eventBus: EventBus;
    readonly gameStateModel: GameStateModel;
    readonly boardModel: BoardModel;
}