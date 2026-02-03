import { TileRuntimeState } from "../../../application/board/runtime/BoardRuntimeModel";
import { TileDestroyed } from "../events/mutations/TileDestroyed";
import { TilePosition } from "../models/TilePosition";
import { BoardService } from "./BoardService";

export class DestroyService extends BoardService {
    public destroy(cluster: TilePosition[]): TileDestroyed[] {
        const result: TileDestroyed[] = [];

        for (const position of cluster) {
            const id = this.logicalModel.get(position);
            if (!id) continue;
            this.logicalModel.destroy(position);
            this.runtimeModel.set(id, TileRuntimeState.DESTROYING);
            this.tileRepository.remove(id);

            const destroyed: TileDestroyed = {
                kind: "tile.destroy",
                id: id,
                at: position,
                cause: "match"
            };
            
            result.push(destroyed);
        }

        return result;
    }
}