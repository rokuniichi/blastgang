import { BoardModel } from "../models/BoardModel";
import { TileModel } from "../models/TileModel";
import { TileType } from "../models/TileType";
import { TileCluster } from "../models/TileCluster";

export class TileClusterService {

    private _visited: boolean[] = [];

    public findCluster(board: BoardModel, startX: number, startY: number): TileCluster | null {
        const startTile = board.get(startX, startY);
        if (!startTile) return null;

        const targetType = startTile.type;
        if (targetType === TileType.NONE) return null;

        const width = board.width;
        const height = board.height;
        const size = width * height;
        
        if (this._visited.length < size) {
            this._visited = new Array(size).fill(false);
        } else {
            this._visited.fill(false, 0, size);
        }

        const stack: TileModel[] = [startTile];
        const tiles: TileModel[] = [];

        while (stack.length > 0) {
            const tile = stack.pop()!;

            const index = tile.y * width + tile.x;
            if (this._visited[index]) continue;
            this._visited[index] = true;

            if (tile.type !== targetType) continue;

            tiles.push(tile);

            this.queueNeighbours(board, tile, stack);
        }

        if (tiles.length === 0) return null;

        return new TileCluster(tiles, targetType);
    }

    private queueNeighbours(board: BoardModel, tile: TileModel, stack: TileModel[]): void {
        const x = tile.x;
        const y = tile.y;

        if (x > 0) stack.push(board.get(x - 1, y)!);
        if (x < board.width - 1) stack.push(board.get(x + 1, y)!);
        if (y > 0) stack.push(board.get(x, y - 1)!);
        if (y < board.height - 1) stack.push(board.get(x, y + 1)!);
    }
}