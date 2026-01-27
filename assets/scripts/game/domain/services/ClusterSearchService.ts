import { BoardModel } from "../models/BoardModel";
import { TileType } from "../models/TileType";
import { TileCluster } from "../models/TileCluster";
import { TilePosition } from "../models/TilePosition";


export class ClusterSearchService {

    private _visited: boolean[] = [];

    public findCluster(board: BoardModel, position: TilePosition): TileCluster | null {
        const targetType = board.get(position);

        if (targetType === TileType.NONE) return null;

        const width = board.width;
        const height = board.height;
        const size = width * height;

        if (this._visited.length < size) {
            this._visited = new Array(size).fill(false);
        } else {
            this._visited.fill(false, 0, size);
        }

        const stack: TilePosition[] = [position];
        const tiles: TilePosition[] = [];

        while (stack.length > 0) {
            const position = stack.pop()!;

            const index = position.y * width + position.x;
            if (this._visited[index]) continue;
            this._visited[index] = true;

            if (board.get(position) !== targetType) continue;

            tiles.push(position);

            this.queueNeighbours(board, position, stack);
        }

        if (tiles.length === 0) return null;

        return new TileCluster(tiles, targetType);
    }

    private queueNeighbours(board: BoardModel, position: TilePosition, stack: TilePosition[]): void {
        if (position.x > 0)                stack.push({ x: position.x - 1, y: position.y });
        if (position.x < board.width - 1)  stack.push({ x: position.x + 1, y: position.y });
        if (position.y > 0)                stack.push({ x: position.x,     y: position.y - 1 });
        if (position.y < board.height - 1) stack.push({ x: position.x,     y: position.y + 1 });
    }
}