import { EventBus } from "../../../core/events/EventBus";
import { GameConfig } from "../../config/game/GameConfig";
import { VisualConfig } from "../../config/visual/VisualConfig";
import { TileSpawned } from "../../domain/board/events/mutations/TileSpawned";
import { GameStateModel } from "../../domain/state/models/GameStateModel";

export class PresentationContext {
    public readonly visualConfig: VisualConfig;
    public readonly eventBus: EventBus;
    public readonly movesLeft: number;
    public readonly targetScore: number;
    public readonly currentScore: number;
    public readonly boardCols: number;
    public readonly boardRows: number;
    public readonly initialBoard: TileSpawned[];

    public constructor(visualConfig: VisualConfig, gameConfig: GameConfig, eventBus: EventBus, stateModel: GameStateModel, initialBoard: TileSpawned[]) {
        this.visualConfig = visualConfig;
        this.eventBus = eventBus;
        this.movesLeft = stateModel.movesLeft;
        this.targetScore = stateModel.targetScore;
        this.currentScore = stateModel.currentScore;
        this.boardCols = gameConfig.board.cols;
        this.boardRows = gameConfig.board.rows;
        this.initialBoard = initialBoard;
    }
}