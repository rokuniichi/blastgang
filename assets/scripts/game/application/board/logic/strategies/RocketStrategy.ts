import { BoardMutationsBatch } from "../../../../domain/board/events/BoardMutationsBatch";
import { TileId } from "../../../../domain/board/models/BoardLogicModel";
import { TileType } from "../../../../domain/board/models/TileType";
import { DestroyService } from "../../../../domain/board/services/DestroyService";
import { MoveService } from "../../../../domain/board/services/MoveService";
import { SpawnService } from "../../../../domain/board/services/SpawnService";
import { BoardInteractivityModel } from "../../runtime/models/BoardInteractivityModel";
import { BaseBoardStrategy } from "./BaseBoardStrategy";


export class RocketStrategy extends BaseBoardStrategy {
    private readonly _type: TileType;
    private readonly _destroyService: DestroyService;
    public constructor(
        type: TileType,
        interactivityModel: BoardInteractivityModel,

        destroyService: DestroyService,
        moveService: MoveService,
        spawnService: SpawnService
    ) {
        super(interactivityModel, moveService, spawnService);
        this._type = type;
        this._destroyService = destroyService;
    }

    public execute(id: TileId): BoardMutationsBatch {
        const batch = new BoardMutationsBatch();
        let mutation = null;
        switch (this._type) {
            case TileType.HORIZONTAL_ROCKET: mutation = this._destroyService.destroyInRow(id, "horizontal_rocket"); break;
            case TileType.VERTICAL_ROCKET: mutation = this._destroyService.destroyInCol(id, "vertical_rocket"); break;
            default: break;
        }
        if (mutation === null) return batch;
        batch.push(mutation);
        mutation.destroyed.forEach((id) => {
            this.block(id);
            this.destabilize(id)
        });
        this.drop(batch);
        this.spawn(batch);
        return batch;
    }
}