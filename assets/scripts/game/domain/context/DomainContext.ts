import { EventBus } from "../../../core/events/EventBus";
import { BoardController } from "../../application/board/controllers/BoardController";
import { BoardRuntimeModel } from "../../application/board/runtime/BoardRuntimeModel";
import { GameConfig } from "../../application/common/config/game/GameConfig";
import { GameStateController } from "../../application/state/controllers/GameStateController";
import { BoardLogicalModel } from "../board/models/BoardLogicalModel";
import { TileFactory } from "../board/models/TileFactory";
import { TileRepository } from "../board/models/TileRepository";
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

    public readonly tileFactory: TileFactory;

    public readonly logicalModel: BoardLogicalModel;
    public readonly runtimeModel: BoardRuntimeModel;
    public readonly tileRepository: TileRepository;
    public readonly spawnService: SpawnService;
    public readonly searchService: SearchService;
    public readonly destroyService: DestroyService;
    public readonly moveService: MoveService;
    public readonly boardController: BoardController;

    public constructor(gameConfig: GameConfig) {
        this.gameConfig = gameConfig;
        const boardInfo = this.gameConfig.board;
        const stateInfo = this.gameConfig.gameState;

        this.eventBus = new EventBus();

        this.gameStateModel = new GameStateModel(stateInfo.maxMoves, stateInfo.targetScore, 0, GameStateType.PLAYING);
        this.scoreService = new ScoreService(stateInfo.scoreMultiplier);
        this.gameStateController = new GameStateController(this);

        this.logicalModel = new BoardLogicalModel(boardInfo.cols, boardInfo.rows);

        this.runtimeModel = new BoardRuntimeModel();
        this.tileRepository = new TileRepository();

        this.tileFactory = new TileFactory();

        this.spawnService = new SpawnService(this.logicalModel, this.runtimeModel, this.tileRepository, this.tileFactory, boardInfo.allowedTypes);
        this.searchService = new SearchService(this.logicalModel, this.runtimeModel, this.tileRepository);
        this.destroyService = new DestroyService(this.logicalModel, this.runtimeModel, this.tileRepository);
        this.moveService = new MoveService(this.logicalModel, this.runtimeModel, this.tileRepository);

        this.boardController = new BoardController(this);
    }
}