import { BoardInfo, GameConfig, GameStateInfo } from "../config/game/GameConfig";
import { BoardLogicModel } from "./board/models/BoardLogicModel";
import { TileFactory } from "./board/models/TileFactory";
import { TilePositionRepo } from "./board/models/TilePositionRepo";
import { TileTypeRepo } from "./board/models/TileTypeRepo";
import { DestroyService } from "./board/services/DestroyService";
import { MoveService } from "./board/services/MoveService";
import { SearchService } from "./board/services/SearchService";
import { SpawnService } from "./board/services/SpawnService";
import { GameStateModel } from "./state/models/GameStateModel";
import { ScoreService } from "./state/services/ScoreService";

export class DomainGraph {
    public readonly boardInfo: BoardInfo;
    public readonly stateInfo: GameStateInfo;

    public readonly gameStateModel: GameStateModel;
    public readonly logicModel: BoardLogicModel;
    public readonly typeRepo: TileTypeRepo;
    public readonly positionRepo: TilePositionRepo;
    public readonly tileFactory: TileFactory;

    public readonly spawnService: SpawnService;
    public readonly searchService: SearchService;
    public readonly destroyService: DestroyService;
    public readonly moveService: MoveService;
    public readonly scoreService: ScoreService;

    constructor(gameConfig: GameConfig) {
        this.boardInfo = gameConfig.board;
        this.stateInfo = gameConfig.gameState;

        this.gameStateModel = new GameStateModel(this.stateInfo);

        this.logicModel = new BoardLogicModel(this.boardInfo.cols, this.boardInfo.rows);
        this.typeRepo = new TileTypeRepo();
        this.positionRepo = new TilePositionRepo();
        this.tileFactory = new TileFactory();

        this.scoreService = new ScoreService(this.stateInfo.scoreMultiplier);

        this.spawnService = new SpawnService(
            this.logicModel,
            this.typeRepo,
            this.positionRepo,
            this.tileFactory,
            this.boardInfo.allowedTypes
        );

        this.searchService = new SearchService(this.logicModel, this.typeRepo, this.positionRepo);
        this.destroyService = new DestroyService(this.logicModel, this.typeRepo, this.positionRepo);
        this.moveService = new MoveService(this.logicModel, this.typeRepo, this.positionRepo);
    }
}
