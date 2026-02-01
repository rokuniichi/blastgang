import { Matrix } from "../../../../core/collections/Matrix";
import { TileMove } from "../models/TileMove";
import { TilePosition } from "../models/TilePosition";
import { TileType } from "../models/TileType";
import { BoardService } from "./BoardService";

export class SearchService extends BoardService {
    public findCluster(start: TilePosition): TilePosition[] {
        const targetType = this.logicalModel.get(start);

        const result = [];
        const visited = new Matrix<boolean>(this.logicalModel.width, this.logicalModel.height, () => false);
        const stack = [start];

        while (stack.length > 0 && targetType !== TileType.EMPTY) {
            const position = stack.pop();
            if (!position) continue;

            if (visited.get(position.x, position.y)) continue;

            visited.set(position.x, position.y, true);

            if (this.runtimeModel.isLocked(position) || this.logicalModel.get(position) !== targetType) {
                continue;
            }

            result.push(position);

            stack.push(...this.findNeighbors(position));
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
            if (position.x < 0 || position.y < 0 || position.x >= this.logicalModel.width || position.y >= this.logicalModel.height) {
                continue;
            }
            result.push(position);
        }

        return result;
    }

    public findDrops(): TileMove[] {
        const result: TileMove[] = [];
        for (let x = this.logicalModel.width - 1; x >= 0; x--) {
            let drop = 0;
            for (let y = this.logicalModel.height - 1; y >= 0; y--) {
                if (this.logicalModel.empty({ x, y })) drop++;
                else if (drop > 0) result.push({ from: { x, y }, to: { x, y: y + drop } });
            }
        }

        return result;
    }

}