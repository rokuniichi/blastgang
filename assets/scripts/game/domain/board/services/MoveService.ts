import { TileLockReason } from "../../../application/board/runtime/BoardRuntime";
import { TileMove } from "../models/TileMove";
import { BoardService } from "./BoardService";

export class MoveService extends BoardService {
    public move(moves: readonly TileMove[]): void {
        for (const move of moves) {
            this.boardRuntime.lock(TileLockReason.MOVE, move.to);
            this.logicalModel.move(move)
        }
    }
}