import { BoardModel } from "../models/BoardModel";
import { TileDrop } from "../models/TileDrop";
import { TileType } from "../models/TileType";

export class GravityService {

    public apply(board: BoardModel, drops: readonly TileDrop[]): void {
        for (const move of drops) {
            const type = board.get(move.from);
            board.set(move.from, TileType.NONE);
            board.set(move.to, type);
        }
    }
}