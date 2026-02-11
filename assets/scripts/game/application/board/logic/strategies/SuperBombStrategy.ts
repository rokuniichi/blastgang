import { BoardInfo } from "../../../../config/game/GameConfig";
import { BoardMutationsBatch } from "../../../../domain/board/events/BoardMutationsBatch";
import { TileId } from "../../../../domain/board/models/BoardLogicModel";
import { DestroyService } from "../../../../domain/board/services/DestroyService";
import { MoveService } from "../../../../domain/board/services/MoveService";
import { SpawnService } from "../../../../domain/board/services/SpawnService";
import { BoardInteractivityModel } from "../../runtime/models/BoardInteractivityModel";
import { BaseBoardStrategy } from "./BaseBoardStrategy";

export class SuperBombStrategy extends BaseBoardStrategy {
    private readonly _destroyService: DestroyService;

    public constructor(
        interactivityMode: BoardInteractivityModel,
        destroyService: DestroyService,
        moveService: MoveService,
        spawnService: SpawnService
    ) {
        super(interactivityMode, moveService, spawnService);
        this._destroyService = destroyService;
    }

    public execute(id: TileId): BoardMutationsBatch {
        const batch = new BoardMutationsBatch();
        const mutation = this._destroyService.destroyAll(id, "superbomb");
        if (mutation === null) return batch;
        batch.push(mutation);
        mutation.destroyed.forEach((id) => this.destabilize(id));
        this.drop(batch);
        this.spawn(batch);
        return batch;
    }
}
