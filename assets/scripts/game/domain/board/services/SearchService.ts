import { Matrix } from "../../../../core/collections/Matrix";
import { BoardRuntimeModel } from "../../../application/board/models/BoardRuntimeModel";
import { TileMoved } from "../events/mutations/TileMoved";
import { TileId } from "../models/BoardLogicModel";
import { TilePosition } from "../models/TilePosition";
import { TileType } from "../models/TileType";
import { BoardService } from "./BoardService";

export class SearchService extends BoardService {
    public findCluster(id: TileId, runtime: BoardRuntimeModel): TilePosition[] {
        const startType = this.typeRepo.get(id);
        const startPosition = this.positionRepo.get(id);
        if (startType === null || startPosition === null) return [];

        const result = [];
        const visited = new Matrix<boolean>(this.logicModel.width, this.logicModel.height, () => false);
        const stack = [startPosition];

        while (stack.length > 0 && startType !== TileType.EMPTY) {
            const currentPosition = stack.pop();
            if (!currentPosition) continue;

            if (visited.get(currentPosition.x, currentPosition.y)) continue;

            visited.set(currentPosition.x, currentPosition.y, true);

            const targetId = this.logicModel.get(currentPosition);
            if (!targetId) continue;

            if (runtime.lockedTile(targetId) || this.typeRepo.get(targetId) !== startType) {
                continue;
            }

            result.push(currentPosition);

            stack.push(...this.findNeighbors(currentPosition));
        }

        return result;
    }

    public findNeighbors(position: TilePosition): TilePosition[] {
        const neighbors: TilePosition[] = [
            { x: position.x + 1, y: position.y },
            { x: position.x - 1, y: position.y },
            { x: position.x, y: position.y + 1 },
            { x: position.x, y: position.y - 1 },
        ];

        const result: TilePosition[] = [];

        for (const position of neighbors) {
            if (position.x < 0 || position.y < 0 || position.x >= this.logicModel.width || position.y >= this.logicModel.height) {
                continue;
            }
            result.push(position);
        }

        return result;
    }
}