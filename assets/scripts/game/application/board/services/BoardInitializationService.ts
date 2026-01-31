import { LogicalBoardModel } from "../../../domain/board/models/LogicalBoardModel";
import { TileChange } from "../../../domain/board/models/TileChange";
import { TileType } from "../../../domain/board/models/TileType";
import { SpawnService } from "../../../domain/board/services/SpawnService";
import { RuntimeBoardModel, TileLockReason } from "../runtime/RuntimeBoardModel";

export class BoardInitializationService {
    public constructor(
        private readonly _allowedTypes: TileType[],
        private readonly _logicalModel: LogicalBoardModel,
        private readonly _runtimeModel: RuntimeBoardModel,
        private readonly _spawnService: SpawnService
    ) { }

    public initialize(): TileChange[] {
        const spawned = this._spawnService.spawn(this._allowedTypes);
        spawned.forEach((spawn, _) => this._runtimeModel.unlock(TileLockReason.SPAWN, spawn.at));
        return this._logicalModel.flush();
    }
}