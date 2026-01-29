import { Matrix } from "../../../../core/collections/Matrix";
import { BoardModel } from "../models/BoardModel";
import { TileMove } from "../models/TileMove";
import { TilePosition } from "../models/TilePosition";
import { TileType } from "../models/TileType";

export class SearchService {

    public constructor() { }

    public findCluster(board: BoardModel, start: TilePosition): TilePosition[] {
        const targetType = board.get(start);

        const result = [];
        const visited = new Matrix<boolean>(board.width, board.height, () => false);
        const stack = [start];

        while (stack.length > 0 && targetType !== TileType.NONE) {
            const position = stack.pop();
            if (!position) continue;

            if (visited.get(position.x, position.y)) continue;

            visited.set(position.x, position.y, true);

            if (board.get(position) !== targetType) {
                continue;
            }

            result.push(position);

            stack.push(...this.findNeighbors(board, position));
        }

        return result;
    }

    public findNeighbors(board: BoardModel, position: TilePosition): TilePosition[] {
        const neighbors: TilePosition[] = [
            { x: position.x + 1, y: position.y },
            { x: position.x - 1, y: position.y },
            { x: position.x, y: position.y + 1 },
            { x: position.x, y: position.y - 1 },
        ];

        const result: TilePosition[] = [];

        for (const position of neighbors) {
            if (position.x < 0 || position.y < 0 || position.x >= board.width || position.y >= board.height) {
                continue;
            }
            result.push(position);
        }

        return result;
    }

    public findDrops(board: BoardModel): TileMove[] {
        const result: TileMove[] = [];
        for (let x = board.width - 1; x >= 0; x--) {
            let drop = 0;
            for (let y = board.height - 1; y >= 0; y--) {
                if (board.empty({ x, y })) drop++;
                else if (drop > 0) result.push({ from: { x, y }, to: { x, y: y + drop } });
            }
        }

        return result;
    }

}