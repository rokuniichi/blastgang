import { TileLockReason } from "../../../application/board/runtime/BoardRuntimeModel";
import { TileDestroy } from "../models/TileDestroy";
import { TilePosition } from "../models/TilePosition";
import { BoardService } from "./BoardService";

export class DestroyService extends BoardService {
    public destroy(cluster: TilePosition[]): TileDestroy[] {
        const result: TileDestroy[] = [];

        for (const position of cluster) {
            const type = this.logicalModel.get(position);
            this.logicalModel.destroy(position);
            this.runtimeModel.lock(TileLockReason.DESTROY, position);
            result.push({ type, at: position });
        }

        return result;
    }
}