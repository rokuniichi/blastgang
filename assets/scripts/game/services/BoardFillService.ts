import { BoardModel } from "../models/BoardModel";
import { TileType } from "../models/TileType";

export class BoardFillService {
    public fillEmpty(board: BoardModel): void {
        this.fillAll(board, TileType.NONE);
    }

    public fillWithType(board: BoardModel, type: TileType): void {
        this.fillAll(board, type);
    }

    private fillAll(board: BoardModel, type: TileType): void {
        for (let x = 0; x < board.width; x++) {
            for (let y = 0; y < board.height; y++) {
                board.setTile(x, y, type);
            }
        }
    }
}