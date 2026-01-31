import { EventBus } from "../../../core/events/EventBus";
import { BoardController } from "../../application/board/controllers/BoardController";
import { RuntimeBoardModel } from "../../application/board/runtime/RuntimeBoardModel";
import { GameConfig } from "../../application/common/config/GameConfig";
import { GameStateController } from "../../application/state/controllers/GameStateController";
import { LogicalBoardModel } from "../board/models/LogicalBoardModel";
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
    public readonly runtimeModel: RuntimeBoardModel;
    public readonly spawnService: SpawnService;
    public readonly searchService: SearchService;
    public readonly destroyService: DestroyService;
    public readonly moveService: MoveService;
    public readonly boardController: BoardController;

    public constructor(config: GameConfig) {
        this.gameConfig = config;
        this.eventBus = new EventBus();

        this.gameStateModel = new GameStateModel(config.maxMoves, config.targetScore, 0, GameStateType.PLAYING);
        this.scoreService = new ScoreService(config.scoreMultiplier);
        this.gameStateController = new GameStateController(this);

        this.logicalModel = new LogicalBoardModel(config.boardWidth, config.boardHeight);
        this.runtimeModel = new RuntimeBoardModel(config.boardWidth, config.boardHeight);
        this.spawnService = new SpawnService(this.logicalModel, this.runtimeModel,);
        this.searchService = new SearchService(this.logicalModel, this.runtimeModel);
        this.destroyService = new DestroyService(this.logicalModel, this.runtimeModel);
        this.moveService = new MoveService(this.logicalModel, this.runtimeModel);

        this.boardController = new BoardController(this);
    }
}