import { EventBus } from "../../../core/events/EventBus";
import { BoardModel } from "../../domain/board/models/BoardModel";
import { TileChange } from "../../domain/board/models/TileChange";
import { TileChangeReason } from "../../domain/board/models/TileChangeReason";
import { ClearService } from "../../domain/board/services/ClearService";
import { MoveService } from "../../domain/board/services/MoveService";
import { SearchService } from "../../domain/board/services/SearchService";
import { SpawnService } from "../../domain/board/services/SpawnService";
import { GameStateModel } from "../../domain/state/models/GameStateModel";
import { ScoreService } from "../../domain/state/services/ScoreService";
import { GameConfig } from "../config/GameConfig";
import { BoardController } from "../controllers/board/BoardController";
import { GameStateController } from "../controllers/state/GameStateController";

export class DomainContext {
    public readonly gameConfig: GameConfig;
    public readonly eventBus: EventBus;

    public readonly gameStateModel: GameStateModel;
    public readonly scoreService: ScoreService;
    public readonly gameStateController: GameStateController;

    public readonly boardModel: BoardModel;
    public readonly spawnService: SpawnService;
    public readonly searchService: SearchService;
    public readonly clearService: ClearService;
    public readonly moveService: MoveService;
    public readonly boardController: BoardController;

    public readonly initialBoard: TileChange[];

    public constructor(config: GameConfig) {
        this.gameConfig = config;
        this.eventBus = new EventBus();

        this.gameStateModel = new GameStateModel(config.maxMoves, config.targetScore, 0);
        this.scoreService = new ScoreService(config.scoreMultiplier);
        this.gameStateController = new GameStateController(this);

        this.boardModel = new BoardModel(config.boardWidth, config.boardHeight);
        this.spawnService = new SpawnService(config.allowedTypes);
        this.searchService = new SearchService();
        this.clearService = new ClearService();
        this.moveService = new MoveService();
        this.boardController = new BoardController(this);

        this.spawnService.spawn(TileChangeReason.SPAWNED, this.boardModel);
        this.initialBoard = this.boardModel.changes;
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