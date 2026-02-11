import { MoveMutation } from "../events/mutations/MoveMutation";
import { TileMutationHelper } from "../events/mutations/TileMutationHelper";
import { TileId } from "../models/BoardLogicModel";
import { BoardService } from "./BoardService";

export class MoveService extends BoardService {
    public move(moves: readonly MoveMutation[]): void {
        for (const move of moves) {
            const id = this.logicModel.get(move.from.x, move.from.y);
            if (!id) continue;
            this.logicModel.move(move.from, move.to);
            this.positionRepo.move(id, move.to);
        }
    }

    public swap(first: TileId, second: TileId): MoveMutation[] {
        const result = [];
        const source = this.positionRepo.get(first);
        const target = this.positionRepo.get(second);

        if (source && target) {
            this.positionRepo.move(first, target);
            this.positionRepo.move(second, source);
            this.logicModel.swap(source, target);

            const firstMove = TileMutationHelper.moved(first, source, target, "swap");
            const secondMove = TileMutationHelper.moved(second, target, source, "swap");

            result.push(firstMove, secondMove);
        }

        return result;
    }

    public drop(): MoveMutation[] {
        const result: MoveMutation[] = [];
        for (let x = this.logicModel.width - 1; x >= 0; x--) {
            let drop = 0;
            for (let y = this.logicModel.height - 1; y >= 0; y--) {
                if (this.logicModel.empty(x, y)) {
                    drop++;
                } else if (drop > 0) {
                    const id = this.logicModel.get(x, y);
                    if (!id) continue;
                    const target = { x: x, y: y + drop };
                    const moved = TileMutationHelper.moved(id, { x, y }, target, "drop");
                    result.push(moved);
                }
            }
        }

        this.move(result);
        return result;
    }
}