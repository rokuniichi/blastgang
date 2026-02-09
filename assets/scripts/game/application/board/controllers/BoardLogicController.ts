import { EventBus } from "../../../../core/eventbus/EventBus";
import { BoardInfo } from "../../../config/game/GameConfig";
import { BoardMutationsBatch } from "../../../domain/board/events/BoardMutationsBatch";
import { TileMutation } from "../../../domain/board/events/mutations/TileMutation";
import { TileMutationHelper } from "../../../domain/board/events/mutations/TileMutationHelper";
import { TileRejectedReason } from "../../../domain/board/events/mutations/TileRejected";
import { BoardLogicModel, TileId } from "../../../domain/board/models/BoardLogicModel";
import { TilePosition } from "../../../domain/board/models/TilePosition";
import { TilePositionRepo } from "../../../domain/board/models/TilePositionRepo";
import { TileTypeRepo } from "../../../domain/board/models/TileTypeRepo";
import { DestroyService } from "../../../domain/board/services/DestroyService";
import { MoveService } from "../../../domain/board/services/MoveService";
import { SearchService } from "../../../domain/board/services/SearchService";
import { SpawnService } from "../../../domain/board/services/SpawnService";
import { DomainGraph } from "../../../domain/DomainGraph";
import { GameStateSync } from "../../../domain/state/events/GameStateSync";
import { GameStateModel } from "../../../domain/state/models/GameStateModel";
import { GameStateType } from "../../../domain/state/models/GameStateType";
import { EventController } from "../../common/controllers/BaseController";
import { NormalClickIntent } from "../../input/intents/NormalClickIntent";
import { SwapClickIntent } from "../../input/intents/SwapClickIntent";
import { BoardRuntimeModel } from "../models/BoardRuntimeModel";

export class BoardLogicController extends EventController {

    private readonly _boardInfo: BoardInfo;
    private readonly _boardRuntime: BoardRuntimeModel;
    private readonly _gameStateModel: GameStateModel;
    private readonly _logicModel: BoardLogicModel;
    private readonly _typeRepo: TileTypeRepo;
    private readonly _positionRepo: TilePositionRepo;
    private readonly _spawnService: SpawnService;
    private readonly _searchService: SearchService;
    private readonly _destroyService: DestroyService;
    private readonly _moveService: MoveService;


    public constructor(eventBus: EventBus, domain: DomainGraph, runtimeModel: BoardRuntimeModel) {
        super(eventBus);

        this._boardInfo = domain.boardInfo;
        this._boardRuntime = runtimeModel;
        this._gameStateModel = domain.gameStateModel;
        this._logicModel = domain.logicModel;
        this._typeRepo = domain.typeRepo;
        this._positionRepo = domain.positionRepo;
        this._spawnService = domain.spawnService;
        this._searchService = domain.searchService;
        this._destroyService = domain.destroyService;
        this._moveService = domain.moveService;
    }

    protected onInit(): void {
        console.log(`[BOARD CONTROL] INIT COMMAND`);
        const spawned = this._spawnService.spawn();
        const initialBatch = new BoardMutationsBatch([...spawned]);
        this.blockBoard(spawned);
        this.emit(initialBatch);
        console.log(`[BOARD CONTROL] initial mutations: ${spawned.length}`);
        this.on(NormalClickIntent, this.onNormalClickIntent);
        this.on(SwapClickIntent, this.onSwapClickIntent);
    }

    private onNormalClickIntent = (event: NormalClickIntent): void => {
        console.log(`[BOARD CONTROL] click allowed: ${this.clickAllowed()}, state: ${GameStateType[this._gameStateModel.state]}, board is locked: ${this._boardRuntime.lockedBoard()}`);
        if (!this.clickAllowed()) return;
        const batch = this.buildNormal(event.id);
        this.emit(batch);
    };

    private onSwapClickIntent = (event: SwapClickIntent): void => {
        if (!this.clickAllowed()) return;
        const batch = this.buildSwap(event.first, event.second);
        this.emit(batch);
    };

    private clickAllowed(): boolean {
        return this._gameStateModel.state === GameStateType.PLAYING && !this._boardRuntime.lockedBoard();
    }

    private buildNormal(id: TileId): BoardMutationsBatch {
        console.log(`[BOARD CONTROL] building ${id}...`);
        if (id === null) return this.reject("_", TileRejectedReason.NON_EXISTANT);
        if (this._boardRuntime.lockedTile(id)) return this.reject(id, TileRejectedReason.UNSTABLE);
        console.log(`[BOARD CONTROL] accepted...`);
        const cluster = this.findCluster(id);
        console.log(`[BOARD CONTROL] cluster of ${cluster.length}`);
        if (!this.validCluster(cluster)) {
            console.log(`[BOARD CONTROL] cluster NOT valid, rejecting`);
            this._boardRuntime.addUnstable(id);
            return this.reject(id, TileRejectedReason.NO_MATCH);
        }

        console.log(`[BOARD CONTROL] MUTATING`);
        return this.mutate(cluster);
    }

    private buildSwap(first: TileId, second: TileId): BoardMutationsBatch {
        this._boardRuntime.addUnstable(first);
        this._boardRuntime.addUnstable(second);
        const swapped = this._moveService.swap(first, second);
        return new BoardMutationsBatch([...swapped]);
    }

    private validCluster(cluster: TilePosition[]): boolean {
        return cluster.length >= this._boardInfo.clusterSize;
    }

    private findCluster(id: TileId): TilePosition[] {
        return this._searchService.findCluster(id, this._boardRuntime);
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
            this._boardRuntime.addUnstable(mutation.id)
        }
    }

    private blockBoard(mutations: TileMutation[]): void {
        for (const mutation of mutations) {
            this._boardRuntime.addBlocker(mutation.id)
        }
    }

    private reject(id: string, reason: TileRejectedReason): BoardMutationsBatch {
        return new BoardMutationsBatch([TileMutationHelper.rejected(id, reason)]);
    }
}