import { TileLockReason } from "../../../application/board/runtime/BoardRuntimeModel";
import { TileMove } from "../models/TileMove";
import { BoardService } from "./BoardService";

export class MoveService extends BoardService {
    public move(moves: readonly TileMove[]): void {
        for (const move of moves) {
            this.runtimeModel.lock(TileLockReason.MOVE, move.from);
            this.logicalModel.move(move)
        }
    }
}