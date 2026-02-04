import { BoardInfo, GameConfig, GameStateInfo } from "../config/game/GameConfig";
import { BoardLogicModel } from "./board/models/BoardLogicModel";
import { TileFactory } from "./board/models/TileFactory";
import { TileRepository } from "./board/models/TileRepository";
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
    public readonly tileRepository: TileRepository;
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
        this.tileRepository = new TileRepository();
        this.tileFactory = new TileFactory();

        this.scoreService = new ScoreService(this.stateInfo.scoreMultiplier);

        this.spawnService = new SpawnService(
            this.logicModel,
            this.tileRepository,
            this.tileFactory,
            this.boardInfo.allowedTypes
        );

        this.searchService = new SearchService(this.logicModel, this.tileRepository);
        this.destroyService = new DestroyService(this.logicModel, this.tileRepository);
        this.moveService = new MoveService(this.logicModel, this.tileRepository);
    }
}
