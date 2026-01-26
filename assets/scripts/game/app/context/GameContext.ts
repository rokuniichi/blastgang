import { GameEventBus } from "../../../core/event-system/EventBus";
import { GameConfig } from "../../config/GameConfig";
import { BoardModel } from "../../domain/models/BoardModel";
import { GameStateModel } from "../../domain/models/GameStateModel";
import { BoardFillService } from "../../domain/services/BoardFillService";
import { BoardController } from "../controllers/BoardController";
import { GameStateController } from "../controllers/GameStateController";

export class GameContext {

    public readonly gameConfig: GameConfig;
    public readonly gameEventBus: GameEventBus;
    public readonly boardModel: BoardModel;
    public readonly gameState: GameStateModel;

    constructor(gameConfig: GameConfig) {
        this.gameConfig = gameConfig;

        this.gameEventBus = new GameEventBus();

        this.boardModel = new BoardModel(this.gameConfig.boardWidth, this.gameConfig.boardHeight);
        this.gameState  = new GameStateModel(this.gameConfig.maxMoves, this.gameConfig.targetScore);

        const boardFillService = new BoardFillService(this.gameConfig);

        const boardController     = new BoardController(this.boardModel, boardFillService);
        const gameStateController = new GameStateController(this.gameState);
    }
}