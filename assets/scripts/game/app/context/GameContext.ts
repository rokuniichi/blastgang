import { EventBus } from "../../../core/event-system/EventBus";
import { BoardModel } from "../../domain/models/BoardModel";
import { BoardFillService } from "../../domain/services/BoardFillService";
import { BoardController } from "../controllers/BoardController";
import { GameConfig } from "../../config/GameConfig";
import { TileClusterService } from "../../domain/services/TileClusterService";

export class GameContext {

    public readonly eventBus: EventBus;
    public readonly boardModel: BoardModel;

    public readonly boardFillService: BoardFillService;
    public readonly tileClusterService: TileClusterService;

    public readonly boardController: BoardController;
    
    private readonly _config: GameConfig;

    constructor(config: GameConfig) {
        this._config = config;
        this.eventBus = new EventBus();

        this.boardModel = new BoardModel(this._config.boardWidth, this._config.boardHeight);

        this.boardFillService = new BoardFillService(this._config);
        this.tileClusterService = new TileClusterService();

        this.boardController = new BoardController(
            this.boardModel,
            this.boardFillService,
            this.tileClusterService,
            this.eventBus
        );
    }

    public dispose(): void {
        this.boardController.unsubscribe();
        this.eventBus.clear();
    }
}