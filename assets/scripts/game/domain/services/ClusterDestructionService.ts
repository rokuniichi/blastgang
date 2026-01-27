import { BoardModel } from "../models/BoardModel";
import { TileCluster } from "../models/TileCluster";
import { TileType } from "../models/TileType";

export class ClusterDestructionService {

    public destroy(board: BoardModel, cluster: TileCluster): void {
        for (const tile of cluster.tiles) {
            board.set(tile.x, tile.y, TileType.NONE);
        }
    }
}