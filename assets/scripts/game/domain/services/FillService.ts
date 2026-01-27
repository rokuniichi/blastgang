import { BoardModel } from "../models/BoardModel";
import { TileType } from "../models/TileType";

export class FillService {

    private readonly allowedTypes: TileType[];

    public constructor(types: TileType[]) {
        this.allowedTypes = types;
    }

    public fillRandom(board: BoardModel): void {
        for (let y = 0; y < board.height; y++) {
            for (let x = 0; x < board.width; x++) {
                board.set({ x, y }, this.randomTile());
            }
        }
    }

    private randomTile(): TileType {
        const types = this.allowedTypes;
        const index = Math.floor(Math.random() * types.length);
        return types[index];
    }
}