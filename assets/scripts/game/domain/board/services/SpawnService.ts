import { BoardModel } from "../models/BoardModel";
import { TileType } from "../models/TileType";

export class SpawnService {

    private readonly _allowedTypes: TileType[];

    public constructor(allowedTypes: TileType[]) {
        this._allowedTypes = allowedTypes;
    }

    public fill(board: BoardModel): void {
        for (let x = 0; x < board.width; x++) {
            for (let y = 0; y < board.height; y++) {
                const position = { x, y };

                if (board.empty(position)) {
                    const type = this.randomTile();
                    board.set(position, type);
                }
            }
        }
    }

    private randomTile(): TileType {
        const types = this._allowedTypes;
        return types[Math.floor(Math.random() * types.length)];
    }
}