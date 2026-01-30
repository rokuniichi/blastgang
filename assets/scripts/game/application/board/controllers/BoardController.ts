import { EventBus } from "../../../../core/events/EventBus";
import { SubscriptionGroup } from "../../../../core/events/SubscriptionGroup";
import { BoardProcessResult } from "../../../domain/board/events/BoardProcessResult";
import { TileClickRejectedEvent, TileClickRejectedReason } from "../../../domain/board/events/TileClickRejection";
import { LogicalBoardModel } from "../../../domain/board/models/LogicalBoardModel";
import { DestroyService } from "../../../domain/board/services/DestroyService";
import { MoveService } from "../../../domain/board/services/MoveService";
import { SearchService } from "../../../domain/board/services/SearchService";
import { SpawnService } from "../../../domain/board/services/SpawnService";
import { DomainContext } from "../../../domain/context/DomainContext";
import { GameStateModel } from "../../../domain/state/models/GameStateModel";
import { BoardSyncedEvent } from "../../../presentation/board/events/BoardSyncedEvent";
import { TileClickedCommand } from "../../../presentation/board/events/TileClickedCommand";
import { GameConfig } from "../../common/config/GameConfig";
import { BaseController } from "../../common/controllers/BaseController";
import { BoardRuntime } from "../runtime/BoardRuntime";

export class BoardController extends BaseController {

    private readonly _subscriptions: SubscriptionGroup = new SubscriptionGroup();

    private readonly _gameConfig: GameConfig;
    private readonly _eventBus: EventBus;
    private readonly _gameStateModel: GameStateModel;
    private readonly _logicalModel: LogicalBoardModel;
    private readonly _boardRuntime: BoardRuntime;
    private readonly _spawnService: SpawnService;
    private readonly _searchService: SearchService;
    private readonly _destroyService: DestroyService;
    private readonly _moveService: MoveService;

    public constructor(context: DomainContext) {
        super();

        this._gameConfig = context.gameConfig;
        this._eventBus = context.eventBus;
        this._gameStateModel = context.gameStateModel;
        this._logicalModel = context.logicalModel;
        this._boardRuntime = context.boardRuntime;
        this._spawnService = context.spawnService;
        this._searchService = context.searchService;
        this._destroyService = context.destroyService;
        this._moveService = context.moveService;
    }

    protected onInit(): void {
        this._subscriptions.add(
            this._eventBus.on(TileClickedCommand, this.onTileClicked)
        );

        this._subscriptions.add(
            this._eventBus.on(BoardSyncedEvent, this.onBoardSynced)
        )
    }

    private onTileClicked = (event: TileClickedCommand): void => {
        if (this._boardRuntime.isLocked(event.position)) {
            this._eventBus.emit(new TileClickRejectedEvent(TileClickRejectedReason.LOCKED, event.position));
            return;
        }

        const cluster = this._searchService.findCluster(event.position);

        if (cluster.length < this._gameConfig.clusterSize) {
            this._eventBus.emit(new TileClickRejectedEvent(TileClickRejectedReason.NO_CLUSTER, event.position));
            return;
        }

        const destroyed = this._destroyService.destroy(cluster);
        const dropped = this._searchService.findDrops();
        this._moveService.move(dropped);
        const spawned = this._spawnService.spawn();
        const changes = this._logicalModel.flush();
        this._eventBus.emit(new BoardProcessResult(destroyed, dropped, spawned, changes));
    };

    private onBoardSynced = (): void => {
        this._boardRuntime.unlockAll();
    }

    public dispose(): void {
        this._subscriptions.clear();
    }
}