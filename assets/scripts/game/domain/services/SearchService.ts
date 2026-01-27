import { BoardModel } from "../models/BoardModel";
import { Cluster } from "../models/Cluster";
import { TilePosition } from "../models/TilePosition";
import { TileType } from "../models/TileType";

export class SearchService {

    public constructor() { }

    public findCluster(board: BoardModel, start: TilePosition): Cluster | null {
        const targetType: TileType = board.get(start);

        if (targetType === TileType.NONE) {
            return null;
        }

        const visited: boolean[][] = [];
        const result: TilePosition[] = [];
        const stack: TilePosition[] = [start];

        while (stack.length > 0) {
            const position = stack.pop();
            if (!position) continue;

            if (visited[position.x][position.y]) continue;

            visited[position.x][position.y] = true;

            if (board.get(position) !== targetType) {
                continue;
            }

            result.push(position);

            stack.push(...this.findNeighbors(board, position));
        }

        return result.length > 0 ? new Cluster(result) : null;
    }

    private findNeighbors(board: BoardModel, position: TilePosition): TilePosition[] {
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

}