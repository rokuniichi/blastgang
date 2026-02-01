import { BoardLogicalModel } from "../../../domain/board/models/BoardLogicalModel";
import { TileCommit } from "../../../domain/board/models/TileCommit";
import { TileType } from "../../../domain/board/models/TileType";
import { SpawnService } from "../../../domain/board/services/SpawnService";
import { BoardRuntimeModel, TileLockReason } from "../runtime/BoardRuntimeModel";

export class BoardInitializationService {
    public constructor(
        private readonly _allowedTypes: TileType[],
        private readonly _logicalModel: BoardLogicalModel,
        private readonly _runtimeModel: BoardRuntimeModel,
        private readonly _spawnService: SpawnService
    ) { }

    public initialize(): TileCommit[] {
        const spawned = this._spawnService.spawn(this._allowedTypes);
        spawned.forEach((spawn, _) => this._runtimeModel.unlock(TileLockReason.SPAWN, spawn.at));
        return this._logicalModel.flush();
    }
}