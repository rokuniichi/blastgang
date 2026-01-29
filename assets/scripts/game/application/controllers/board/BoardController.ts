import { EventBus } from "../../../../core/events/EventBus";
import { SubscriptionGroup } from "../../../../core/events/SubscriptionGroup";
import { BoardChangedEvent } from "../../../domain/board/events/BoardProcessedEvent";
import { BoardProcessingEvent } from "../../../domain/board/events/BoardProcessingEvent";
import { BoardModel } from "../../../domain/board/models/BoardModel";
import { DestructionService } from "../../../domain/board/services/DestructionService";
import { GravityService } from "../../../domain/board/services/GravityService";
import { SearchService } from "../../../domain/board/services/SearchService";
import { SpawnService } from "../../../domain/board/services/SpawnService";
import { GameStateModel } from "../../../domain/state/models/GameStateModel";
import { TileClickedEvent } from "../../../presentation/events/TileClickedEvent";
import { GameConfig } from "../../config/GameConfig";
import { DomainContext } from "../../context/DomainContext";
import { BaseController } from "../BaseController";

export class BoardController extends BaseController {

    private readonly _subscriptions: SubscriptionGroup = new SubscriptionGroup();

    private readonly _gameConfig: GameConfig;
    private readonly _eventBus: EventBus;
    private readonly _gameStateModel: GameStateModel;
    private readonly _boardModel: BoardModel;
    private readonly _spawnService: SpawnService;
    private readonly _searchService: SearchService;
    private readonly _destructionService: DestructionService;
    private readonly _gravityService: GravityService;

    public constructor(context: DomainContext) {
        super();

        this._gameConfig = context.gameConfig;
        this._eventBus = context.eventBus;
        this._gameStateModel = context.gameStateModel;
        this._boardModel = context.boardModel;
        this._spawnService = context.spawnService;
        this._searchService = context.searchService;
        this._destructionService = context.destructionService;
        this._gravityService = context.gravityService;
    }

    protected onInit(): void {
        this._subscriptions.add(
            this._eventBus.on(TileClickedEvent, this.onTileClicked)
        );
    }

    private onTileClicked = (event: TileClickedEvent): void => {
        if (this._gameStateModel.state !== "IDLE") return;
        const cluster = this._searchService.findCluster(this._boardModel, event.position);

        if (cluster.length < this._gameConfig.clusterSize) return;
        this._eventBus.emit(new BoardProcessingEvent());

        const destroyed = this._destructionService.destroy(this._boardModel, cluster);
        const dropped = this._searchService.findDrops(this._boardModel);
        this._gravityService.apply(this._boardModel, dropped);
        this._spawnService.fill(this._boardModel);

        const changes = this._boardModel.changes;

        this._eventBus.emit(new BoardChangedEvent(destroyed, dropped, changes));
    };

    public dispose(): void {
        this._subscriptions.clear();
    }
}