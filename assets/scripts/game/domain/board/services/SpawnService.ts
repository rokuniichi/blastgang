import { BoardModel } from "../models/BoardModel";
import { TileChangeReason } from "../models/TileChangeReason";
import { TilePosition } from "../models/TilePosition";
import { TileType } from "../models/TileType";

export class SpawnService {

    private readonly _allowedTypes: TileType[];

    public constructor(allowedTypes: TileType[]) {
        this._allowedTypes = allowedTypes;
    }

    public spawn(reason: TileChangeReason, board: BoardModel): TilePosition[] {
        const result = [];
        for (let x = 0; x < board.width; x++) {
            for (let y = 0; y < board.height; y++) {
                const position = { x, y };

                if (board.empty(position)) {
                    const type = this.randomTile();
                    board.set(reason, position, type);
                    result.push(position);
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