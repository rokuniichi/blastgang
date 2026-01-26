import { GameConfig } from "../configs/GameConfig";
import { GameEventBus } from "../events/GameEventBus";
import { BoardModel } from "../models/BoardModel";
import { GameState } from "../models/GameState";
import { BoardController } from "../controllers/BoardController";
import { GameStateController } from "../controllers/GameStateController";
import { BoardFillService } from "../services/BoardFillService";

export class GameContext {

    public readonly gameConfig: GameConfig;
    public readonly gameEventBus: GameEventBus;
    public readonly boardModel: BoardModel;
    public readonly gameState: GameState;

    constructor(gameConfig: GameConfig) {
        this.gameConfig = gameConfig;

        this.gameEventBus = new GameEventBus();

        this.boardModel = new BoardModel(this.gameConfig.boardWidth, this.gameConfig.boardHeight);
        this.gameState  = new GameState(this.gameConfig.maxMoves, this.gameConfig.targetScore);

        const boardFillService = new BoardFillService();

        const boardController     = new BoardController(this.boardModel, boardFillService);
        const gameStateController = new GameStateController(this.gameState);
    }
}