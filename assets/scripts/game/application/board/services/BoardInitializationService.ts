import { LogicalBoardModel } from "../../../domain/board/models/LogicalBoardModel";
import { SpawnService } from "../../../domain/board/services/SpawnService";
import { TileChange } from "../../../domain/board/models/TileChange";

export class BoardInitializationService {

    public constructor(private readonly logicalModel: LogicalBoardModel, private readonly spawnService: SpawnService) { }

    public initialize(): TileChange[] {
        this.spawnService.initialSpawn();
        return this.logicalModel.flush();
    }
}