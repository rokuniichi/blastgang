import { EventBus } from "../../../core/events/EventBus";
import { BoardController } from "../../application/board/controllers/BoardController";
import { BoardRuntime } from "../../application/board/runtime/BoardRuntime";
import { GameConfig } from "../../application/common/config/GameConfig";
import { BaseController } from "../../application/common/controllers/BaseController";
import { GameStateController } from "../../application/state/controllers/GameStateController";
import { LogicalBoardModel } from "../board/models/LogicalBoardModel";
import { TileChange } from "../board/models/TileChange";
import { DestroyService } from "../board/services/DestroyService";
import { MoveService } from "../board/services/MoveService";
import { SearchService } from "../board/services/SearchService";
import { SpawnService } from "../board/services/SpawnService";
import { GameStateModel } from "../state/models/GameStateModel";
import { GameStateType } from "../state/models/GameStateType";
import { ScoreService } from "../state/services/ScoreService";

export class DomainContext {
    public readonly gameConfig: GameConfig;
    public readonly eventBus: EventBus;

    public readonly gameStateModel: GameStateModel;
    public readonly scoreService: ScoreService;
    public readonly gameStateController: GameStateController;

    public readonly logicalModel: LogicalBoardModel;
    public readonly boardRuntime: BoardRuntime;
    public readonly spawnService: SpawnService;
    public readonly searchService: SearchService;
    public readonly destroyService: DestroyService;
    public readonly moveService: MoveService;
    public readonly boardController: BoardController;

    public readonly controllers: BaseController[] = [];

    public initialBoard: TileChange[] = [];

    public constructor(config: GameConfig) {
        this.gameConfig = config;
        this.eventBus = new EventBus();

        this.gameStateModel = new GameStateModel(config.maxMoves, config.targetScore, 0, GameStateType.PLAYING);
        this.scoreService = new ScoreService(config.scoreMultiplier);
        this.gameStateController = new GameStateController(this);

        this.logicalModel = new LogicalBoardModel(config.boardWidth, config.boardHeight);
        this.boardRuntime = new BoardRuntime(config.boardWidth, config.boardHeight);
        this.spawnService = new SpawnService(this.logicalModel, this.boardRuntime, config.allowedTypes);
        this.searchService = new SearchService(this.logicalModel, this.boardRuntime);
        this.destroyService = new DestroyService(this.logicalModel, this.boardRuntime);
        this.moveService = new MoveService(this.logicalModel, this.boardRuntime);

        this.boardController = new BoardController(this);

        this.controllers.push(
            this.gameStateController,
            this.boardController
        )
    }

    public dispose(): void {
        this.boardController.dispose();
        this.gameStateController.dispose();
        this.eventBus.clear();
    }
}