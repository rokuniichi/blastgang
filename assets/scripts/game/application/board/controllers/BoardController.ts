import { EventBus } from "../../../../core/events/EventBus";
import { SubscriptionGroup } from "../../../../core/events/SubscriptionGroup";
import { BoardMutationsBatch } from "../../../domain/board/events/BoardMutationsBatch";
import { TileMutations } from "../../../domain/board/events/mutations/TileMutations";
import { TileRejectedReason } from "../../../domain/board/events/mutations/TileRejected";
import { BoardLogicalModel } from "../../../domain/board/models/BoardLogicalModel";
import { TilePosition } from "../../../domain/board/models/TilePosition";
import { TileRepository } from "../../../domain/board/models/TileRepository";
import { DestroyService } from "../../../domain/board/services/DestroyService";
import { MoveService } from "../../../domain/board/services/MoveService";
import { SearchService } from "../../../domain/board/services/SearchService";
import { SpawnService } from "../../../domain/board/services/SpawnService";
import { DomainContext } from "../../../domain/context/DomainContext";
import { GameStateSync } from "../../../domain/state/events/GameStateSync";
import { GameStateModel } from "../../../domain/state/models/GameStateModel";
import { VisualTileClicked } from "../../../presentation/board/events/VisualTileClicked";
import { GameConfig } from "../../common/config/game/GameConfig";
import { BaseController } from "../../common/controllers/BaseController";
import { BoardRuntimeModel, TileLock } from "../runtime/BoardRuntimeModel";

export class BoardController extends BaseController {

    private readonly _subscriptions: SubscriptionGroup = new SubscriptionGroup();

    private readonly _gameConfig: GameConfig;
    private readonly _eventBus: EventBus;
    private readonly _gameStateModel: GameStateModel;
    private readonly _logicalModel: BoardLogicalModel;
    private readonly _boardRuntime: BoardRuntimeModel;
    private readonly _tileRepository: TileRepository;
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
        this._tileRepository = context.tileRepository;
        this._spawnService = context.spawnService;
        this._searchService = context.searchService;
        this._destroyService = context.destroyService;
        this._moveService = context.moveService;
    }

    protected onInit(): void {
        this._subscriptions.add(
            this._eventBus.on(VisualTileClicked, this.onTileClicked)
        );
    }

    private onTileClicked = (event: VisualTileClicked): void => {
        const stable = this._boardRuntime.stableBoard();
        console.log(`[CONTROL] board stability: ${stable}`);
        if (!stable) return;
        const batch = this.build(event.position);
        this._eventBus.emit(batch);
    };

    private build(position: TilePosition): BoardMutationsBatch {
        const id = this._logicalModel.get(position);
        if (!id) return new BoardMutationsBatch([TileMutations.rejected("_", TileRejectedReason.NON_EXISTANT)]);
        if (!this._boardRuntime.stableTile(id))
            return new BoardMutationsBatch([TileMutations.rejected(id, TileRejectedReason.UNSTABLE)]);

        const cluster = this._searchService.findCluster(position);
        if (cluster.length < this._gameConfig.clusterSize) {
            this._boardRuntime.lockTile(id, TileLock.SHAKE);
            return new BoardMutationsBatch([TileMutations.rejected(id, TileRejectedReason.NO_MATCH)])
        }

        const destroyed = this._destroyService.destroy(cluster);
        const dropped = this._searchService.findDrops();
        this._moveService.move(dropped, TileLock.DROP);
        const spawned = this._spawnService.spawn();
        this._eventBus.emit(new GameStateSync(destroyed.length));
        return new BoardMutationsBatch([...destroyed, ...dropped, ...spawned]);
    }

    public dispose(): void {
        this._subscriptions.clear();
    }
}