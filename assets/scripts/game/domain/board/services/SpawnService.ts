import { BoardRuntime, TileLockReason } from "../../../application/board/runtime/BoardRuntime";
import { BoardModel } from "../models/BoardModel";
import { TileSpawn } from "../models/TileSpawn";
import { TileType } from "../models/TileType";
import { BoardService } from "./BoardService";

export class SpawnService extends BoardService {

    private readonly _allowedTypes: TileType[];

    public constructor(boardModel: BoardModel, boardRuntime: BoardRuntime, allowedTypes: TileType[]) {
        super(boardModel, boardRuntime);
        this._allowedTypes = allowedTypes;
    }

    public spawn(): TileSpawn[] {
        const result = [];
        for (let x = 0; x < this.boardModel.width; x++) {
            for (let y = 0; y < this.boardModel.height; y++) {
                const position = { x, y };

                if (this.boardRuntime.isLocked(position) || this.boardModel.empty(position)) {
                    const type = this.randomTile();
                    const data = { at: position, type: type };
                    this.boardModel.spawn(data);
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