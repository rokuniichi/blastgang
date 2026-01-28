import { EventBus } from "../../../core/events/EventBus";
import { GameConfig } from "../../config/GameConfig";
import { BoardModel } from "../../domain/board/models/BoardModel";
import { DestructionService } from "../../domain/board/services/DestructionService";
import { FillService } from "../../domain/board/services/FillService";
import { GravityService } from "../../domain/board/services/GravityService";
import { SearchService } from "../../domain/board/services/SearchService";
import { GameStateModel } from "../../domain/state/models/GameStateModel";
import { ScoreService } from "../../domain/state/services/ScoreService";
import { BoardController } from "../controllers/board/BoardController";
import { GameStateController } from "../controllers/state/GameStateController";

export class GameContext {
    public readonly gameConfig: GameConfig;
    public readonly eventBus: EventBus;

    public readonly gameStateModel: GameStateModel;
    public readonly scoreService: ScoreService;
    public readonly gameStateController: GameStateController;

    public readonly boardModel: BoardModel;
    public readonly fillService: FillService;
    public readonly searchService: SearchService;
    public readonly destructionService: DestructionService;
    public readonly gravityService: GravityService;
    public readonly boardController: BoardController;

    public constructor(config: GameConfig) {
        this.gameConfig = config;
        this.eventBus = new EventBus();

        this.gameStateModel = new GameStateModel(config.maxMoves, config.targetScore);
        this.scoreService = new ScoreService(config.scoreMultiplier);
        this.gameStateController = new GameStateController(this);

        this.boardModel = new BoardModel(config.boardWidth, config.boardHeight);
        this.fillService = new FillService(config.allowedTypes);
        this.searchService = new SearchService();
        this.destructionService = new DestructionService();
        this.gravityService = new GravityService();
        this.boardController = new BoardController(this);
    }

    public init(): void {
        this.gameStateController.init();
        this.boardController.init();
    }

    public dispose(): void {
        this.boardController.dispose();
        this.gameStateController.dispose();
        this.eventBus.clear();
    }
}