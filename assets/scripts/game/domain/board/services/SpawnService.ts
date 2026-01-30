import { BoardRuntime, TileLockReason } from "../../../application/board/runtime/BoardRuntime";
import { LogicalBoardModel } from "../models/LogicalBoardModel";
import { TileSpawn } from "../models/TileSpawn";
import { TileType } from "../models/TileType";
import { BoardService } from "./BoardService";

export class SpawnService extends BoardService {

    private readonly _allowedTypes: TileType[];

    public constructor(boardModel: LogicalBoardModel, boardRuntime: BoardRuntime, allowedTypes: TileType[]) {
        super(boardModel, boardRuntime);
        this._allowedTypes = allowedTypes;
    }

    public initialSpawn() {
        const spawned = this.spawn();
        spawned.forEach((spawn, _) => this.boardRuntime.unlock(TileLockReason.SPAWN, spawn.at));
    }

    public spawn(): TileSpawn[] {
        const result = [];
        for (let x = 0; x < this.logicalModel.width; x++) {
            for (let y = 0; y < this.logicalModel.height; y++) {
                const position = { x, y };
                if (this.logicalModel.empty(position)) {
                    const type = this.randomTile();
                    const data = { at: position, type: type };
                    this.logicalModel.spawn(data);
                    result.push(data);
                    this.boardRuntime.lock(TileLockReason.SPAWN, data.at);
                }
            }
        }

        return result;
    }

    private randomTile(): TileType {
        const types = this._allowedTypes;
        return types[Math.floor(Math.random() * types.length)];
    }
}