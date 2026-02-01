import { TileLockReason } from "../../../application/board/runtime/BoardRuntimeModel";
import { TilePosition } from "../models/TilePosition";
import { BoardService } from "./BoardService";

export class DestroyService extends BoardService {
    public destroy(cluster: TilePosition[]): TilePosition[] {
        const result: TilePosition[] = [];

        for (const position of cluster) {
            this.logicalModel.destroy(position);
            this.runtimeModel.lock(TileLockReason.DESTROY, position);
            result.push(position);
        }

        return result;
    }
}