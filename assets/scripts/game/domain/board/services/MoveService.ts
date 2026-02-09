import { TileMoved } from "../events/mutations/TileMoved";
import { TileMutationHelper } from "../events/mutations/TileMutationHelper";
import { TileId } from "../models/BoardLogicModel";
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

    public swap(first: TileId, second: TileId): TileMoved[] {
        const result = [];
        const source = this.positionRepo.get(first);
        const target = this.positionRepo.get(second);

        if (source && target) {
            this.positionRepo.register(first, target);
            this.positionRepo.register(second, source);
            this.logicModel.swap(source, target);

            const firstMove = TileMutationHelper.moved(first, source, target, "swap");
            const secondMove = TileMutationHelper.moved(second, target, source, "swap");

            result.push(firstMove, secondMove);
        }

        return result;
    }

    public drop(): TileMoved[] {
        const result: TileMoved[] = [];
        for (let x = this.logicModel.width - 1; x >= 0; x--) {
            let drop = 0;
            for (let y = this.logicModel.height - 1; y >= 0; y--) {
                const source = { x, y };
                if (this.logicModel.empty(source)) {
                    drop++;
                } else if (drop > 0) {
                    const id = this.logicModel.get(source);
                    if (!id) continue;
                    const target = { x: x, y: y + drop };
                    const moved = TileMutationHelper.moved(id, source, target, "drop");
                    result.push(moved);
                }
            }
        }

        this.move(result);
        return result;
    }
}