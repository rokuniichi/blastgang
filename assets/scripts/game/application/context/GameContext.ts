import { EventBus } from "../../../core/event-system/EventBus";
import { GameConfig } from "../../config/GameConfig";
import { BoardModel } from "../../domain/models/BoardModel";
import { FillService } from "../../domain/services/FillService";
import { DestructionService } from "../../domain/services/DestructionService";
import { SearchService } from "../../domain/services/SearchService";
import { BoardController } from "../controllers/BoardController";

export class GameContext {

    public readonly gameConfig: GameConfig;
    public readonly eventBus: EventBus;
    public readonly board: BoardModel;

    public readonly fillService: FillService;
    public readonly searchService: SearchService;
    public readonly destructionService: DestructionService;

    public readonly boardController: BoardController;

    public constructor(config: GameConfig) {
        this.gameConfig = config;
        this.eventBus = new EventBus();
        this.board = new BoardModel(config.boardWidth, config.boardHeight);

        this.fillService = new FillService(config.allowedTileTypes);
        this.searchService = new SearchService();
        this.destructionService = new DestructionService();

        this.boardController = new BoardController(this);
    }

    public init(): void {
        this.boardController.init();
    }

    public dispose(): void {
        this.boardController.dispose();
        this.eventBus.clear();
    }
}