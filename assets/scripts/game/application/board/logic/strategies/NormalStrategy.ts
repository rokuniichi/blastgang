import { BoardInfo } from "../../../../config/game/GameConfig";
import { BoardMutationsBatch } from "../../../../domain/board/events/BoardMutationsBatch";
import { TileMutationHelper } from "../../../../domain/board/events/mutations/TileMutationHelper";
import { TileId } from "../../../../domain/board/models/BoardLogicModel";
import { TileType } from "../../../../domain/board/models/TileType";
import { DestroyService } from "../../../../domain/board/services/DestroyService";
import { MoveService } from "../../../../domain/board/services/MoveService";
import { SearchService } from "../../../../domain/board/services/SearchService";
import { SpawnService } from "../../../../domain/board/services/SpawnService";
import { TransformService } from "../../../../domain/board/services/TransformService";
import { BoardInteractivityModel } from "../../runtime/models/BoardInteractivityModel";
import { BaseBoardStrategy } from "./BaseBoardStrategy";
import { SpecialResolver } from "./SpecialResolver";

export class NormalStrategy extends BaseBoardStrategy {
    private readonly _boardInfo: BoardInfo;
    private readonly _searchService: SearchService;
    private readonly _destroyService: DestroyService;
    private readonly _transformService: TransformService;

    public constructor(
        boardInfo: BoardInfo,
        interactivityModel: BoardInteractivityModel,
        searchService: SearchService,
        destroyService: DestroyService,
        transformService: TransformService,
        moveService: MoveService,
        spawnService: SpawnService
    ) {
        super(interactivityModel, moveService, spawnService);
        this._boardInfo = boardInfo;
        this._searchService = searchService;
        this._destroyService = destroyService;
        this._transformService = transformService;
    }

    public execute(centerId: TileId): BoardMutationsBatch {
        const batch = new BoardMutationsBatch();
        const cluster = this._searchService.findCluster(centerId, this.interactivityModel);

        if (!cluster || cluster.length < this._boardInfo.clusterSize) {
            this.interactivityModel.addUnstable(centerId);
            batch.push(TileMutationHelper.shaked(centerId));
            return batch;
        }

        const specialResolver = new SpecialResolver();
        let specialType = TileType.EMPTY;
        for (const threshold of this._boardInfo.specials) {
            if (cluster.length >= threshold.amount) {
                specialType = specialResolver.resolve(threshold.type);
                break;
            }
        }

        if (specialType !== TileType.EMPTY)
            this.transform(batch, centerId, cluster, specialType);
        else
            this.destroy(batch, centerId, cluster);

        this.drop(batch);
        this.spawn(batch);
        return batch;
    }

    private transform(batch: BoardMutationsBatch, centerId: TileId, cluster: TileId[], type: TileType): void {
        const transform = this._transformService.tryTransform(centerId, cluster, type);
        if (transform === null) return;
        batch.push(transform);
        transform.transformed.forEach((id) => {
            if (this._destroyService.tryDestroyTile(id)) {
                this.destabilize(id);
                this.block(id);
            }
        });

        this.destabilize(centerId);
        this.block(centerId);
    }

    private destroy(batch: BoardMutationsBatch, centerId: TileId, cluster: TileId[]): void {
        const destroy = this._destroyService.destroyNormalCluster(cluster, centerId, "match");
        if (destroy === null) return;
        batch.push(destroy);
        cluster.forEach((id) => this.destabilize(id));
    }
}
