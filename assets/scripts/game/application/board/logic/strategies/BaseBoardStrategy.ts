import { BoardMutationsBatch } from "../../../../domain/board/events/BoardMutationsBatch";
import { TileId } from "../../../../domain/board/models/BoardLogicModel";
import { MoveService } from "../../../../domain/board/services/MoveService";
import { SpawnService } from "../../../../domain/board/services/SpawnService";
import { BoardInteractivityModel } from "../../runtime/models/BoardInteractivityModel";

export abstract class BaseBoardStrategy {
    public constructor(
        protected readonly interactivityModel: BoardInteractivityModel,
        protected readonly moveService: MoveService,
        protected readonly spawnService: SpawnService
    ) { }

    abstract execute(tileId: TileId): BoardMutationsBatch;

    protected drop(batch: BoardMutationsBatch): void {
        const dropped = this.moveService.drop();
        dropped.forEach((drop) => {
            this.destabilize(drop.id);
            batch.push(drop);
        });
    }

    protected spawn(batch: BoardMutationsBatch): void {
        const spawned = this.spawnService.spawn();
        spawned.forEach((spawn) => {
            this.destabilize(spawn.id);
            batch.push(spawn);
        });
    }

    protected destabilize(id: TileId): void {
        this.interactivityModel.addUnstable(id);
    }

    protected block(id: TileId): void {
        this.interactivityModel.addBlocker(id);
    }
}