import { BoardModel } from "../models/BoardModel";
import { Cluster } from "../models/Cluster";
import { TilePosition } from "../models/TilePosition";
import { TileType } from "../models/TileType";

export class SearchService {

    public constructor() {}

    public findCluster(board: BoardModel, start: TilePosition): Cluster | null {
        const startType: TileType = board.get(start);

        if (startType === TileType.NONE) {
            return null;
        }

        const visited: Set<string> = new Set<string>();
        const result: TilePosition[] = [];
        const stack: TilePosition[] = [start];

        const key = (p: TilePosition): string => `${p.x}:${p.y}`;

        while (stack.length > 0) {
            const pos: TilePosition = stack.pop() as TilePosition;
            const k: string = key(pos);

            if (visited.has(k)) {
                continue;
            }

            visited.add(k);

            if (board.get(pos) !== startType) {
                continue;
            }

            result.push(pos);

            const neighbors: TilePosition[] = [
                { x: pos.x + 1, y: pos.y },
                { x: pos.x - 1, y: pos.y },
                { x: pos.x, y: pos.y + 1 },
                { x: pos.x, y: pos.y - 1 },
            ];

            for (const n of neighbors) {
                if (n.x < 0 || n.y < 0 || n.x >= board.width || n.y >= board.height) {
                    continue;
                }
                stack.push(n);
            }
        }

        return result.length > 0 ? new Cluster(result) : null;
    }
}