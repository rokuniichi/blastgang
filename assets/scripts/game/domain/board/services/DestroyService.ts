import { TileDestroyed } from "../events/mutations/TileDestroyed";
import { TileMutationHelper } from "../events/mutations/TileMutationHelper";
import { TilePosition } from "../models/TilePosition";
import { BoardService } from "./BoardService";

export class DestroyService extends BoardService {
    public destroy(cluster: TilePosition[]): TileDestroyed[] {
        const result: TileDestroyed[] = [];

        for (const position of cluster) {
            const id = this.logicModel.get(position);
            if (!id) continue;
            this.logicModel.destroy(position);
            console.log(`[DESTROY SERVICE] destroying: ${id}`);
            this.typeRepo.remove(id);
            const destroyed = TileMutationHelper.destroyed(id, position, "match");
            result.push(destroyed);
        }

        return result;
    }
}