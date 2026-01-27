import { BoardModel } from "../models/BoardModel";
import { TilePosition } from "../models/TilePosition";
import { TileType } from "../models/TileType";

export class FillService {

    private readonly _allowedTypes: TileType[];

    public constructor(allowedTypes: TileType[]) {
        this._allowedTypes = allowedTypes;
    }

    public spawn(board: BoardModel): TilePosition[] {
        const result: TilePosition[] = [];

        for (let x = 0; x < board.width; x++) {
            for (let y = 0; y < board.height; y++) {
                const position: TilePosition = { x, y };

                if (board.isEmpty(position)) {
                    const type = this.randomTile();
                    board.set(position, type);
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