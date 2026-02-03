import { TileLockReason } from "../../../application/board/runtime/BoardRuntimeModel";
import { TileMoved } from "../events/mutations/TileMoved";
import { BoardService } from "./BoardService";

export class MoveService extends BoardService {
    public move(moves: readonly TileMoved[], reason: TileLockReason): void {
        for (const move of moves) {
            const id = this.logicalModel.get(move.from);
            if (!id) continue;
            this.runtimeModel.lock(id, reason);
            this.logicalModel.move(move.from, move.to);
        }
    }
}