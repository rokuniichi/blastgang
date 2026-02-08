import { TileMoved } from "../events/mutations/TileMoved";
import { BoardService } from "./BoardService";

export class MoveService extends BoardService {
    public move(moves: readonly TileMoved[]): void {
        for (const move of moves) {
            const id = this.logicModel.get(move.from);
            if (!id) continue;
            this.logicModel.move(move.from, move.to);
            this.positionRepo.register(id, move.to);
        }
    }
}