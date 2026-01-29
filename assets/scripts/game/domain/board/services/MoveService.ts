import { TileMove } from "../models/TileMove";
import { BoardService } from "./BoardService";

export class MoveService extends BoardService {
    public move(drops: readonly TileMove[]): void {
        for (const drop of drops) {
            this.boardModel.move(drop)
        }
    }
}