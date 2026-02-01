import { EventBus } from "../../../../core/events/EventBus";
import { SubscriptionGroup } from "../../../../core/events/SubscriptionGroup";
import { BoardProcessResult } from "../../../domain/board/events/BoardProcessResult";
import { TileClickRejection, TileClickRejectionReason } from "../../../domain/board/events/TileClickRejection";
import { BoardLogicalModel } from "../../../domain/board/models/BoardLogicalModel";
import { DestroyService } from "../../../domain/board/services/DestroyService";
import { MoveService } from "../../../domain/board/services/MoveService";
import { SearchService } from "../../../domain/board/services/SearchService";
import { SpawnService } from "../../../domain/board/services/SpawnService";
import { DomainContext } from "../../../domain/context/DomainContext";
import { GameStateModel } from "../../../domain/state/models/GameStateModel";
import { TileClickedCommand } from "../../../presentation/board/events/TileClickedCommand";
import { GameConfig } from "../../common/config/GameConfig";
import { BaseController } from "../../common/controllers/BaseController";
import { BoardRuntimeModel } from "../runtime/BoardRuntimeModel";

export class BoardController extends BaseController {

    private readonly _subscriptions: SubscriptionGroup = new SubscriptionGroup();

    private readonly _gameConfig: GameConfig;
    private readonly _eventBus: EventBus;
    private readonly _gameStateModel: GameStateModel;
    private readonly _logicalModel: BoardLogicalModel;
    private readonly _boardRuntime: BoardRuntimeModel;
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
        this._boardRuntime = context.runtimeModel;
        this._spawnService = context.spawnService;
        this._searchService = context.searchService;
        this._destroyService = context.destroyService;
        this._moveService = context.moveService;
    }

    protected onInit(): void {
        this._subscriptions.add(
            this._eventBus.on(TileClickedCommand, this.onTileClicked)
        );
    }

    private onTileClicked = (event: TileClickedCommand): void => {
        if (this._boardRuntime.isLocked(event.position)) {
            this._eventBus.emit(new TileClickRejection(TileClickRejectionReason.LOCKED, event.position));
            return;
        }

        const cluster = this._searchService.findCluster(event.position);

        if (cluster.length < this._gameConfig.clusterSize) {
            this._eventBus.emit(new TileClickRejection(TileClickRejectionReason.NO_CLUSTER, event.position));
            return;
        }

        const destroyed = this._destroyService.destroy(cluster);
        const dropped = this._searchService.findDrops();
        this._moveService.move(dropped);
        const spawned = this._spawnService.spawn(this._gameConfig.allowedTypes);
        const commits = this._logicalModel.flush();
        this._eventBus.emit(new BoardProcessResult(commits, { destroyed, dropped, spawned }));
    };

    public dispose(): void {
        this._subscriptions.clear();
    }
}