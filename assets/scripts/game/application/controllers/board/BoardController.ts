import { EventBus } from "../../../../core/events/EventBus";
import { SubscriptionGroup } from "../../../../core/events/SubscriptionGroup";
import { GameConfig } from "../../../config/GameConfig";
import { BoardProcessedEvent } from "../../../domain/board/events/BoardProcessedEvent";
import { BoardProcessingEvent } from "../../../domain/board/events/BoardProcessingEvent";
import { BoardModel } from "../../../domain/board/models/BoardModel";
import { DestructionService } from "../../../domain/board/services/DestructionService";
import { FillService } from "../../../domain/board/services/FillService";
import { GravityService } from "../../../domain/board/services/GravityService";
import { SearchService } from "../../../domain/board/services/SearchService";
import { GameStateModel } from "../../../domain/state/models/GameStateModel";
import { TileClickedEvent } from "../../../presentation/events/TileClickedEvent";
import { GameContext } from "../../context/GameContext";
import { BaseController } from "../BaseController";

export class BoardController extends BaseController {

    private readonly _subscriptions: SubscriptionGroup = new SubscriptionGroup();

    private readonly config: GameConfig;
    private readonly eventBus: EventBus;
    private readonly gameStateModel: GameStateModel;
    private readonly boardModel: BoardModel;
    private readonly fillService: FillService;
    private readonly searchService: SearchService;
    private readonly destructionService: DestructionService;
    private readonly gravityService: GravityService;

    public constructor(context: GameContext) {
        super();

        this.config = context.gameConfig;
        this.eventBus = context.eventBus;
        this.gameStateModel = context.gameStateModel;
        this.boardModel = context.boardModel;
        this.fillService = context.fillService;
        this.searchService = context.searchService;
        this.destructionService = context.destructionService;
        this.gravityService = context.gravityService;
    }

    protected onInit(): void {
        this.fillService.spawn(this.boardModel);

        this._subscriptions.add(
            this.eventBus.on(TileClickedEvent, this.onTileClicked)
        );
    }

    private onTileClicked = (event: TileClickedEvent): void => {
        if (this.gameStateModel.state !== "IDLE") return;

        const cluster = this.searchService.findCluster(this.boardModel, event.position);

        if (cluster.length < this.config.clusterSize) return;
        this.eventBus.emit(new BoardProcessingEvent());

        const destroyed = this.destructionService.destroy(this.boardModel, cluster);
        const dropped = this.searchService.findDrops(this.boardModel);
        this.gravityService.apply(this.boardModel, dropped);
        const spawned = this.fillService.spawn(this.boardModel);

        this.eventBus.emit(new BoardProcessedEvent(destroyed, dropped, spawned));
    };

    public dispose(): void {
        this._subscriptions.clear();
    }
}