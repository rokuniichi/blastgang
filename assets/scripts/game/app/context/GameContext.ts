import { EventBus } from "../../../core/event-system/EventBus";
import { GameConfig } from "../../config/GameConfig";
import { BoardModel } from "../../domain/models/BoardModel";
import { BoardFillService } from "../../domain/services/BoardFillService";
import { ClusterDestructionService } from "../../domain/services/ClusterDestructionService";
import { ClusterSearchService } from "../../domain/services/ClusterSearchService";
import { BoardController } from "../controllers/BoardController";

export class GameContext {

    public readonly config: GameConfig;
    public readonly eventBus: EventBus;

    public readonly boardModel: BoardModel;

    public readonly boardFillService: BoardFillService;
    public readonly clusterSearchService: ClusterSearchService;
    public readonly clusterDestructionService: ClusterDestructionService;

    public readonly boardController: BoardController;

    constructor(config: GameConfig) {
        this.config = config;
        this.eventBus = new EventBus();

        this.boardModel = new BoardModel(this.config.boardWidth, this.config.boardHeight);
        this.boardFillService = new BoardFillService(this.config);
        this.boardFillService.fillRandom(this.boardModel);

        this.clusterSearchService = new ClusterSearchService();
        this.clusterDestructionService = new ClusterDestructionService();

        this.boardController = new BoardController(
            this.config,
            this.boardModel,
            this.clusterSearchService,
            this.clusterDestructionService
        );
    }
    
    public init(): void {
        this.boardController.init(this.eventBus);
    }

    public dispose(): void {
        this.boardController.dispose();
        this.eventBus.clear();
    }
}
