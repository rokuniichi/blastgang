import { EventBus } from "../../../core/events/EventBus";
import { BoardModel } from "../../domain/board/models/BoardModel";
import { TilePosition } from "../../domain/board/models/TilePosition";
import { TileSpawn } from "../../domain/board/models/TileSpawn";
import { DestroyService } from "../../domain/board/services/DestroyService";
import { MoveService } from "../../domain/board/services/MoveService";
import { SearchService } from "../../domain/board/services/SearchService";
import { SpawnService } from "../../domain/board/services/SpawnService";
import { GameStateModel } from "../../domain/state/models/GameStateModel";
import { ScoreService } from "../../domain/state/services/ScoreService";
import { GameConfig } from "../config/GameConfig";
import { BoardController } from "../controllers/board/BoardController";
import { GameStateController } from "../controllers/state/GameStateController";
import { BoardRuntime } from "../runtime/board/BoardRuntime";

export class DomainContext {
    public readonly gameConfig: GameConfig;
    public readonly eventBus: EventBus;

    public readonly gameStateModel: GameStateModel;
    public readonly scoreService: ScoreService;
    public readonly gameStateController: GameStateController;

    public readonly boardModel: BoardModel;
    public readonly boardRuntime: BoardRuntime;
    public readonly spawnService: SpawnService;
    public readonly searchService: SearchService;
    public readonly clearService: DestroyService;
    public readonly moveService: MoveService;
    public readonly boardController: BoardController;

    public readonly initialBoard: TileSpawn[];

    public constructor(config: GameConfig) {
        this.gameConfig = config;
        this.eventBus = new EventBus();

        this.gameStateModel = new GameStateModel(config.maxMoves, config.targetScore, 0);
        this.scoreService = new ScoreService(config.scoreMultiplier);
        this.gameStateController = new GameStateController(this);

        this.boardModel = new BoardModel(config.boardWidth, config.boardHeight);
        // TODO implement within services
        this.boardRuntime = new BoardRuntime(config.boardWidth, config.boardHeight);
        this.spawnService = new SpawnService(this.boardModel, config.allowedTypes);
        this.searchService = new SearchService(this.boardModel);
        this.clearService = new DestroyService(this.boardModel);
        this.moveService = new MoveService(this.boardModel);
        
        this.boardController = new BoardController(this);

        this.initialBoard = this.spawnService.spawn();
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