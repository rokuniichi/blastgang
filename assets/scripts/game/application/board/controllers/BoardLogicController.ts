import { EventBus } from "../../../../core/eventbus/EventBus";
import { BoardInfo } from "../../../config/game/GameConfig";
import { BoardMutationsBatch } from "../../../domain/board/events/BoardMutationsBatch";
import { TileMutation } from "../../../domain/board/events/mutations/TileMutation";
import { TileMutationHelper } from "../../../domain/board/events/mutations/TileMutationHelper";
import { BoardLogicModel, TileId } from "../../../domain/board/models/BoardLogicModel";
import { TilePosition } from "../../../domain/board/models/TilePosition";
import { TilePositionRepo } from "../../../domain/board/models/TilePositionRepo";
import { TileType } from "../../../domain/board/models/TileType";
import { TileTypeRepo } from "../../../domain/board/models/TileTypeRepo";
import { DestroyService } from "../../../domain/board/services/DestroyService";
import { MoveService } from "../../../domain/board/services/MoveService";
import { SearchService } from "../../../domain/board/services/SearchService";
import { SpawnService } from "../../../domain/board/services/SpawnService";
import { TransformService } from "../../../domain/board/services/TransformService";
import { DomainGraph } from "../../../domain/DomainGraph";
import { GameStateSync } from "../../../domain/state/events/GameStateSync";
import { GameStateModel } from "../../../domain/state/models/GameStateModel";
import { EventController } from "../../common/controllers/BaseController";
import { BombEmplaceIntent } from "../../input/intents/BombEmplaceIntent";
import { NormalIntent } from "../../input/intents/NormalIntent";
import { SwapIntent } from "../../input/intents/SwapIntent";
import { BoardRuntimeModel } from "../models/BoardRuntimeModel";

export class BoardLogicController extends EventController {

    private readonly _boardInfo: BoardInfo;
    private readonly _runtimeModel: BoardRuntimeModel;
    private readonly _stateModel: GameStateModel;
    private readonly _logicModel: BoardLogicModel;
    private readonly _typeRepo: TileTypeRepo;
    private readonly _positionRepo: TilePositionRepo;
    private readonly _spawnService: SpawnService;
    private readonly _searchService: SearchService;
    private readonly _destroyService: DestroyService;
    private readonly _moveService: MoveService;
    private readonly _transformService: TransformService;

    public constructor(eventBus: EventBus, domain: DomainGraph, runtimeModel: BoardRuntimeModel) {
        super(eventBus);

        this._boardInfo = domain.boardInfo;
        this._runtimeModel = runtimeModel;
        this._stateModel = domain.stateModel;
        this._logicModel = domain.logicModel;
        this._typeRepo = domain.typeRepo;
        this._positionRepo = domain.positionRepo;
        this._spawnService = domain.spawnService;
        this._searchService = domain.searchService;
        this._destroyService = domain.destroyService;
        this._moveService = domain.moveService;
        this._transformService = domain.transformService;
    }

    protected onInit(): void {
        console.log(`[BOARD CONTROL] INIT COMMAND`);
        const spawned = this._spawnService.spawn();
        const initialBatch = new BoardMutationsBatch([...spawned]);
        this.blockBoard(spawned);
        this.emit(initialBatch);
        console.log(`[BOARD CONTROL] initial mutations: ${spawned.length}`);
        this.on(NormalIntent, this.onNormalIntent);
        this.on(SwapIntent, this.onSwapIntent);
        this.on(BombEmplaceIntent, this.onBombEmplaceIntent);
    }

    private onNormalIntent = (event: NormalIntent): void => {
        const batch = this.buildNormal(event.id);
        this.emit(batch);
    };

    private onSwapIntent = (event: SwapIntent): void => {
        const batch = this.buildSwap(event.first, event.second);
        this.emit(batch);
    };

    private onBombEmplaceIntent = (event: BombEmplaceIntent): void => {
        const batch = this.buildTransform(event.id, TileType.BOMB);
        this.emit(batch);
    }

    private buildNormal(id: TileId): BoardMutationsBatch {
        const cluster = this.findCluster(id);
        if (!this.validCluster(cluster)) {
            this._runtimeModel.addUnstable(id);
            return new BoardMutationsBatch([TileMutationHelper.shaked(id)]);
        }

        console.log(`[BOARD CONTROL] MUTATING`);
        return this.mutate(cluster);
    }

    private buildSwap(first: TileId, second: TileId): BoardMutationsBatch {
        this._runtimeModel.addUnstable(first);
        this._runtimeModel.addUnstable(second);
        const swapped = this._moveService.swap(first, second);
        return new BoardMutationsBatch([...swapped]);
    }

    private buildTransform(id: TileId, type: TileType): BoardMutationsBatch {
        this._runtimeModel.addUnstable(id);
        const transformed = this._transformService.transform(id, type);
        return new BoardMutationsBatch([transformed]);
    }

    private validCluster(cluster: TilePosition[]): boolean {
        return cluster.length >= this._boardInfo.clusterSize;
    }

    private findCluster(id: TileId): TilePosition[] {
        return this._searchService.findCluster(id, this._runtimeModel);
    }

    private mutate(cluster: TilePosition[]): BoardMutationsBatch {
        const destroyed = this._destroyService.destroy(cluster);
        console.log(`[BOARD CONTROL] destroyed: ${destroyed.length}`);
        const dropped = this._moveService.drop();
        console.log(`[BOARD CONTROL] dropped: ${dropped.length}`);
        const spawned = this._spawnService.spawn();
        console.log(`[BOARD CONTROL] spawned: ${spawned.length}`);
        this.emit(new GameStateSync(destroyed.length));
        const mutations = [...destroyed, ...dropped, ...spawned];
        this.lockMutations(mutations);
        return new BoardMutationsBatch(mutations);
    }

    private lockMutations(mutations: TileMutation[]): void {
        for (const mutation of mutations) {
            this._runtimeModel.addUnstable(mutation.id)
        }
    }

    private blockBoard(mutations: TileMutation[]): void {
        for (const mutation of mutations) {
            this._runtimeModel.addBlocker(mutation.id)
        }
    }
}