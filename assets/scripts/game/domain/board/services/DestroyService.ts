import { TileDestroyed } from "../events/mutations/TileDestroyed";
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