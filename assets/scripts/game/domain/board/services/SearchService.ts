import { Matrix } from "../../../../core/collections/Matrix";
import { TileMoved } from "../events/mutations/TileMoved";
import { TilePosition } from "../models/TilePosition";
import { TileType } from "../models/TileType";
import { BoardService } from "./BoardService";

export class SearchService extends BoardService {
    public findCluster(start: TilePosition): TilePosition[] {
        const startId = this.logicalModel.get(start);
        if (!startId) return [];
        const startType = this.tileRepository.get(startId);

        const result = [];
        const visited = new Matrix<boolean>(this.logicalModel.width, this.logicalModel.height, () => false);
        const stack = [start];

        while (stack.length > 0 && startType !== TileType.EMPTY) {
            const position = stack.pop();
            if (!position) continue;

            if (visited.get(position.x, position.y)) continue;

            visited.set(position.x, position.y, true);

            const targetId = this.logicalModel.get(position);
            if (!targetId) continue;

            if (!this.runtimeModel.stable(targetId) || this.tileRepository.get(targetId) !== startType) {
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

    public findDrops(): TileMoved[] {
        const result: TileMoved[] = [];
        for (let x = this.logicalModel.width - 1; x >= 0; x--) {
            let drop = 0;
            for (let y = this.logicalModel.height - 1; y >= 0; y--) {
                const source = { x, y };
                if (this.logicalModel.empty(source)) {
                    drop++;
                } else if (drop > 0) {
                    const id = this.logicalModel.get(source);
                    if (!id) continue;
                    const target = { x: x, y: y + drop };
                    const moved: TileMoved = {
                        kind: "tile.moved",
                        id,
                        from: source,
                        to: target
                    };
                    result.push(moved);
                }
            }
        }

        return result;
    }

}