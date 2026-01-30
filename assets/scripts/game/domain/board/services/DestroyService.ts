import { TileLockReason } from "../../../application/board/runtime/BoardRuntime";
import { TilePosition } from "../models/TilePosition";
import { BoardService } from "./BoardService";

export class DestroyService extends BoardService {
    public destroy(cluster: TilePosition[]): TilePosition[] {
        const result: TilePosition[] = [];

        for (const position of cluster) {
            this.logicalModel.destroy(position);
            this.boardRuntime.lock(TileLockReason.DESTROY, position);
            result.push(position);
        }

        return result;
    }
}